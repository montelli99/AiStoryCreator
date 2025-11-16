import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { 
      characterIds, 
      prompts, 
      type = 'mixed', // 'image', 'video', 'mixed'
      count = 1 
    } = await request.json();

    if (!characterIds || !Array.isArray(characterIds) || characterIds.length === 0) {
      return NextResponse.json(
        { error: 'Character IDs array is required' },
        { status: 400 }
      );
    }

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json(
        { error: 'Prompts array is required' },
        { status: 400 }
      );
    }

    // Get character details
    const characters = await db.character.findMany({
      where: { 
        id: { in: characterIds },
        isActive: true 
      }
    });

    if (characters.length === 0) {
      return NextResponse.json(
        { error: 'No active characters found' },
        { status: 404 }
      );
    }

    // Create batch job
    const batchJob = await db.jobQueue.create({
      data: {
        type: 'batch_generation',
        status: 'pending',
        priority: 3, // Highest priority for batch jobs
        payload: {
          characterIds,
          prompts,
          type,
          count,
          totalJobs: characterIds.length * prompts.length * count
        }
      }
    });

    // Update batch job to processing
    await db.jobQueue.update({
      where: { id: batchJob.id },
      data: {
        status: 'processing',
        startedAt: new Date(),
        progress: 5
      }
    });

    // Generate individual jobs
    const jobs = [];
    for (const character of characters) {
      for (const prompt of prompts) {
        for (let i = 0; i < count; i++) {
          // Determine if this should be image or video
          const isVideo = type === 'video' || (type === 'mixed' && Math.random() > 0.5);
          
          const job = await db.jobQueue.create({
            data: {
              type: isVideo ? 'video_generation' : 'image_generation',
              status: 'pending',
              priority: 1,
              payload: {
                characterId: character.id,
                prompt,
                characterCode: character.code,
                batchId: batchJob.id
              }
            }
          });
          
          jobs.push({
            id: job.id,
            characterId: character.id,
            characterCode: character.code,
            prompt,
            type: isVideo ? 'video' : 'image'
          });
        }
      }
    }

    // Update batch job with jobs created
    await db.jobQueue.update({
      where: { id: batchJob.id },
      data: {
        progress: 10,
        result: {
          jobsCreated: jobs.length,
          jobs: jobs
        }
      }
    });

    return NextResponse.json({
      success: true,
      batchId: batchJob.id,
      totalJobs: jobs.length,
      jobs,
      message: `Created ${jobs.length} generation jobs`
    });

  } catch (error) {
    console.error('Batch generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}