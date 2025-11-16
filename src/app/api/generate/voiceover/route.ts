import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getElevenLabsClient } from '@/lib/elevenlabs/client';

export async function POST(request: NextRequest) {
  try {
    const { contentId, text, voiceSettings } = await request.json();

    if (!contentId || !text) {
      return NextResponse.json(
        { error: 'Content ID and text are required' },
        { status: 400 }
      );
    }

    // Get content details
    const content = await db.content.findUnique({
      where: { id: contentId },
      include: {
        character: true
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Create job queue entry
    const job = await db.jobQueue.create({
      data: {
        type: 'voiceover_generation',
        status: 'pending',
        priority: 1,
        payload: {
          contentId,
          text,
          voiceSettings,
          characterCode: content.character.code
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
      // Get ElevenLabs client
      const elevenLabsClient = getElevenLabsClient();

      // Update progress
      await db.jobQueue.update({
        where: { id: job.id },
        data: { progress: 30 }
      });

      // Generate character-appropriate speech
      const audioBlob = await elevenLabsClient.generateCharacterSpeech({
        text,
        characterType: content.character.ethnicity as 'korean' | 'japanese' | 'chinese',
        age: content.character.baseAge < 21 ? 'young' : content.character.baseAge < 30 ? 'adult' : 'mature',
        aesthetic: content.character.aestheticType as 'cinematic' | 'influencer',
        ...voiceSettings
      });

      // Update progress
      await db.jobQueue.update({
        where: { id: job.id },
        data: { progress: 80 }
      });

      // Convert blob to base64 for storage
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const audioUrl = `data:audio/mp3;base64,${base64}`;

      // Update content with voiceover
      await db.content.update({
        where: { id: contentId },
        data: {
          // Add voiceover URL to content metadata
          promptVidu: {
            ...content.promptVidu,
            voiceoverUrl: audioUrl,
            voiceoverText: text
          }
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
            contentId,
            audioUrl,
            characterCode: content.character.code,
            duration: audioBlob.size
          }
        }
      });

      return NextResponse.json({
        success: true,
        contentId,
        jobId: job.id,
        audioUrl,
        message: 'Voiceover generated successfully using ElevenLabs'
      });

    } catch (voiceError) {
      console.error('ElevenLabs voiceover generation error:', voiceError);
      
      // Update job with error
      await db.jobQueue.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error: voiceError instanceof Error ? voiceError.message : 'Unknown error',
          completedAt: new Date()
        }
      });

      return NextResponse.json(
        { error: 'Failed to generate voiceover', details: voiceError instanceof Error ? voiceError.message : 'Unknown error' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Voiceover generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}