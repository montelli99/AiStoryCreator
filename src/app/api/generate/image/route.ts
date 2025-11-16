import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getZAIClient } from '@/lib/z-ai/client';

export async function POST(request: NextRequest) {
  try {
    const { characterId, prompt, style = 'photorealistic', size = '1024x1024', numImages = 1 } = await request.json();

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
        type: 'image_generation',
        status: 'pending',
        priority: 1,
        payload: {
          characterId,
          prompt,
          style,
          size,
          numImages,
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
Create a ${style} image of ${character.embedding?.description || character.code}.
${prompt}
Style: ${character.aestheticType}
Ethnicity: ${character.ethnicity}
Age: ${character.baseAge}
Variant: ${character.variant}
`.trim();

      // Update progress
      await db.jobQueue.update({
        where: { id: job.id },
        data: { progress: 30 }
      });

      // Generate image using CogView-4
      const response = await zaiClient.generateImage({
        prompt: enhancedPrompt,
        size: size,
        style: style,
        num_images: numImages
      });

      // Update progress
      await db.jobQueue.update({
        where: { id: job.id },
        data: { progress: 80 }
      });

      // Get the generated image data
      const imageData = response.data?.[0];
      
      if (!imageData) {
        throw new Error('No image data received from Z.ai CogView-4');
      }

      // Handle image data (could be base64 or URL)
      let fileUrl: string;
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        fileUrl = imageData; // Base64 data URL
      } else if (imageData.url) {
        fileUrl = imageData.url; // URL from Z.ai
      } else if (imageData.base64) {
        fileUrl = `data:image/png;base64,${imageData.base64}`; // Base64 string
      } else {
        throw new Error('Unexpected image data format from Z.ai');
      }

      // Create content entry
      const content = await db.content.create({
        data: {
          characterId,
          title: `Generated Image - ${character.code}`,
          description: prompt,
          promptCogView: {
            originalPrompt: prompt,
            enhancedPrompt,
            style,
            size,
            numImages
          },
          status: 'ready',
          fileType: 'image',
          fileUrl,
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
            imageUrl: fileUrl,
            characterCode: character.code
          }
        }
      });

      return NextResponse.json({
        success: true,
        contentId: content.id,
        jobId: job.id,
        imageUrl: fileUrl,
        message: 'Image generated successfully using Z.ai CogView-4'
      });

    } catch (zaiError) {
      console.error('Z.ai CogView-4 generation error:', zaiError);
      
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
        { error: 'Failed to generate image', details: zaiError instanceof Error ? zaiError.message : 'Unknown error' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}