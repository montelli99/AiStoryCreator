import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/queue - List all jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const jobs = await db.jobQueue.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      include: {
        // We could include related data here if needed
      }
    });

    // Get summary statistics
    const stats = await db.jobQueue.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      jobs,
      stats: statusCounts,
      total: jobs.length
    });

  } catch (error) {
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue' },
      { status: 500 }
    );
  }
}

// POST /api/queue - Add new job
export async function POST(request: NextRequest) {
  try {
    const { type, payload, priority = 1 } = await request.json();

    if (!type || !payload) {
      return NextResponse.json(
        { error: 'Type and payload are required' },
        { status: 400 }
      );
    }

    const job = await db.jobQueue.create({
      data: {
        type,
        status: 'pending',
        priority,
        payload
      }
    });

    return NextResponse.json({
      success: true,
      job,
      message: 'Job added to queue successfully'
    });

  } catch (error) {
    console.error('Error adding job to queue:', error);
    return NextResponse.json(
      { error: 'Failed to add job to queue' },
      { status: 500 }
    );
  }
}