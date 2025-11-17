/**
 * GET/POST /api/video/render-queue
 * Manages video rendering queue
 */

import { NextResponse } from 'next/server';
import { videoEngine, queueManager } from '@/lib/video-engine';

export async function GET() {
  try {
    const stats = videoEngine.getQueueStatus();
    const jobs = queueManager.getAllJobs();

    return NextResponse.json({
      success: true,
      stats,
      jobs: jobs.map(j => ({
        id: j.id,
        projectId: j.projectId,
        status: j.status,
        priority: j.priority,
        createdAt: j.createdAt,
        startedAt: j.startedAt,
        completedAt: j.completedAt,
      })),
    });
  } catch (error) {
    console.error('Queue fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, sceneId, variationId, priority } = body;

    if (!projectId || !sceneId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const jobId = videoEngine.queueRender(
      projectId,
      sceneId,
      variationId
    );

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Job queued for rendering',
    });
  } catch (error) {
    console.error('Queue add error:', error);
    return NextResponse.json(
      { error: 'Failed to queue job' },
      { status: 500 }
    );
  }
}

