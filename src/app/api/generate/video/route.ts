import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getZAIClient } from '@/lib/z-ai/client';

export async function POST(request: NextRequest) {
  try {
    const { characterId, prompt, duration = 5, resolution = '1920x1080' } = await request.json();

    if (!characterId || !prompt) {
      return NextResponse.json(
        { error: 'Character ID and prompt are required' },
        { status: 400 }
      );
    }

    // Get character details
    const character = await db.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    // Create job queue entry
    const job = await db.jobQueue.create({
      data: {
        type: 'video_generation',
        status: 'pending',
        priority: 2, // Higher priority for videos
        payload: {
          characterId,
          prompt,
          duration,
          resolution,
          characterCode: character.code
        }
      }
    });

    // Update job status to processing
    await db.jobQueue.update({
      where: { id: job.id },
      data: {
        status: 'processing',
        startedAt: new Date(),
        progress: 10
      }
    });

    try {
      // Get Z.ai client
      const zaiClient = getZAIClient();

      // Enhanced prompt with character context
      const enhancedPrompt = `
Create a ${duration}-second video of ${character.embedding?.description || character.code}.
${prompt}
Style: ${character.aestheticType}
Ethnicity: ${character.ethnicity}
Age: ${character.baseAge}
Variant: ${character.variant}
Resolution: ${resolution}
Consistency anchor: ${character.code}
`.trim();

      // Update progress
      await db.jobQueue.update({
        where: { id: job.id },
        data: { progress: 30 }
      });

      // Generate video using Vidu-Q1
      const response = await zaiClient.generateVideo({
        prompt: enhancedPrompt,
        duration,
        resolution,
        consistency_anchor: character.code
      });

      // Update progress
      await db.jobQueue.update({
        where: { id: job.id },
        data: { progress: 80 }
      });

      // Get the generated video data
      const videoData = response.data?.[0];
      
      if (!videoData) {
        throw new Error('No video data received from Z.ai Vidu-Q1');
      }

      // Handle video data (could be base64 or URL)
      let fileUrl: string;
      if (typeof videoData === 'string' && videoData.startsWith('data:')) {
        fileUrl = videoData; // Base64 data URL
      } else if (videoData.url) {
        fileUrl = videoData.url; // URL from Z.ai
      } else if (videoData.base64) {
        fileUrl = `data:video/mp4;base64,${videoData.base64}`; // Base64 string
      } else {
        throw new Error('Unexpected video data format from Z.ai');
      }

      // Create content entry
      const content = await db.content.create({
        data: {
          characterId,
          title: `Generated Video - ${character.code}`,
          description: prompt,
          promptVidu: {
            originalPrompt: prompt,
            enhancedPrompt,
            duration,
            resolution
          },
          status: 'ready',
          fileType: 'video',
          fileUrl,
          duration,
          aesthetic: character.aestheticType,
          tags: `${character.ethnicity},${character.aestheticType},${character.code}`
        }
      });

      // Complete job
      await db.jobQueue.update({
        where: { id: job.id },
        data: {
          status: 'completed',
          progress: 100,
          completedAt: new Date(),
          result: {
            contentId: content.id,
            videoUrl: fileUrl,
            characterCode: character.code,
            duration
          }
        }
      });

      return NextResponse.json({
        success: true,
        contentId: content.id,
        jobId: job.id,
        videoUrl: fileUrl,
        duration,
        message: 'Video generated successfully using Z.ai Vidu-Q1'
      });

    } catch (zaiError) {
      console.error('Z.ai Vidu-Q1 generation error:', zaiError);
      
      // Update job with error
      await db.jobQueue.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error: zaiError instanceof Error ? zaiError.message : 'Unknown error',
          completedAt: new Date()
        }
      });

      return NextResponse.json(
        { error: 'Failed to generate video', details: zaiError instanceof Error ? zaiError.message : 'Unknown error' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}