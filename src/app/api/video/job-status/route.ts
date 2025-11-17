/**
 * GET /api/video/job-status?jobId=xxx
 * Gets status of a specific render job
 */

import { NextResponse } from 'next/server';
import { videoEngine } from '@/lib/video-engine';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    const job = videoEngine.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        projectId: job.projectId,
        sceneId: job.sceneId,
        variationId: job.variationId,
        status: job.status,
        progress: this.calculateProgress(job),
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        error: job.error,
      },
    });
  } catch (error) {
    console.error('Job status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}

function calculateProgress(job: any): number {
  switch (job.status) {
    case 'queued':
      return 0;
    case 'processing':
      return 50;
    case 'complete':
      return 100;
    case 'failed':
      return 0;
    default:
      return 0;
  }
}

