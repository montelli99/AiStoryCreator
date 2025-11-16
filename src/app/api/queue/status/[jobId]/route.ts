import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/queue/status/[jobId] - Get specific job status
export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const job = await db.jobQueue.findUnique({
      where: { id: params.jobId }
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}

// PUT /api/queue/status/[jobId] - Update job status
export async function PUT(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { status, progress, result, error } = await request.json();

    const updateData: any = { updatedAt: new Date() };
    
    if (status) {
      updateData.status = status;
      if (status === 'processing') {
        updateData.startedAt = new Date();
      } else if (status === 'completed' || status === 'failed') {
        updateData.completedAt = new Date();
      }
    }
    
    if (progress !== undefined) updateData.progress = progress;
    if (result) updateData.result = result;
    if (error) updateData.error = error;

    const job = await db.jobQueue.update({
      where: { id: params.jobId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      job,
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}