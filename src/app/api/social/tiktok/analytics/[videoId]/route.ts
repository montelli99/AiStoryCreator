import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TikTokClient } from '@/lib/tiktok/client';
import { getServerSession } from '@/lib/auth';

// GET /api/social/tiktok/analytics/[videoId] - Get video analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoId } = params;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID required' }, { status: 400 });
    }

    // Get user's TikTok credentials
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { tiktokClientId: true, tiktokClientSecret: true }
    });

    if (!user?.tiktokClientId || !user?.tiktokClientSecret) {
      return NextResponse.json({ error: 'TikTok not configured' }, { status: 400 });
    }

    // Initialize TikTok client
    const tiktokClient = new TikTokClient({
      client_id: user.tiktokClientId,
      client_secret: user.tiktokClientSecret
    });

    // Get video analytics
    const analytics = await tiktokClient.getVideoAnalytics(videoId);

    // Update analytics record in database
    await db.analytics.updateMany({
      where: {
        postId: videoId,
        platform: 'tiktok'
      },
      data: {
        views: analytics.views,
        likes: analytics.likes,
        comments: analytics.comments,
        shares: analytics.shares,
        engagementRate: analytics.engagement_rate
      }
    });

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('TikTok analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TikTok analytics' },
      { status: 500 }
    );
  }
}