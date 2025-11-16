import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/analytics/summary - Get dashboard metrics
export async function GET() {
  try {
    // Get content counts
    const totalContent = await db.content.count();
    const videoContent = await db.content.count({ where: { fileType: 'video' } });
    const imageContent = await db.content.count({ where: { fileType: 'image' } });

    // Get character counts
    const totalCharacters = await db.character.count();
    const activeCharacters = await db.character.count({ where: { isActive: true } });

    // Get job queue stats
    const pendingJobs = await db.jobQueue.count({ where: { status: 'pending' } });
    const processingJobs = await db.jobQueue.count({ where: { status: 'processing' } });

    // Get today's posts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPosts = await db.schedule.count({
      where: {
        postTime: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get average performance score
    const avgPerformanceResult = await db.analytics.aggregate({
      _avg: {
        performanceScore: true
      }
    });

    const avgPerformance = avgPerformanceResult._avg.performanceScore || 0;

    // Get top performing characters
    const topCharacters = await db.character.findMany({
      take: 3,
      orderBy: {
        performanceScore: 'desc'
      },
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    });

    // Get recent content with analytics
    const recentContent = await db.content.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        character: {
          select: {
            code: true
          }
        },
        analytics: {
          select: {
            performanceScore: true
          }
        }
      }
    });

    // Calculate weekly growth (mock data for now)
    const weeklyGrowth = 15.2;

    return NextResponse.json({
      totalContent,
      videoContent,
      imageContent,
      totalCharacters,
      activeCharacters,
      pendingJobs,
      processingJobs,
      todayPosts,
      avgPerformance: avgPerformanceResult._avg.performanceScore || 0,
      weeklyGrowth,
      topCharacters: topCharacters.map(char => ({
        code: char.code,
        performance: char.performanceScore,
        content: char._count.contents
      })),
      recentContent: recentContent.map(content => ({
        id: content.id,
        title: content.title,
        character: content.character.code,
        type: content.fileType,
        status: content.status,
        performance: content.analytics?.performanceScore || 0
      }))
    });

  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics summary' },
      { status: 500 }
    );
  }
}