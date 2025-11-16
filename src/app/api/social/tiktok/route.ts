import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TikTokClient } from '@/lib/tiktok/client';
import { getServerSession, authOptions } from '@/lib/auth';

// POST /api/social/tiktok/post - Post video to TikTok
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { video_url, caption, hashtags, content_id } = await request.json();

    if (!video_url || !caption) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // Post video to TikTok
    const result = await tiktokClient.postVideo({
      video_url,
      caption,
      hashtags: hashtags || []
    });

    // Update content record with TikTok post info
    if (content_id) {
      await db.content.update({
        where: { id: content_id },
        data: {
          tiktokPostId: result.id,
          tiktokPostUrl: result.share_url,
          status: 'posted'
        }
      });
    }

    // Create analytics record
    await db.analytics.create({
      data: {
        contentId: content_id,
        platform: 'tiktok',
        postId: result.id,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
      }
    });

    return NextResponse.json({
      success: true,
      post: result
    });

  } catch (error) {
    console.error('TikTok post error:', error);
    return NextResponse.json(
      { error: 'Failed to post to TikTok' },
      { status: 500 }
    );
  }
}

// GET /api/social/tiktok/trends - Get trending hashtags
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's TikTok credentials
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { tiktokClientId: true, tiktokClientSecret: true }
    });

    if (!user?.tiktokClientId || !user?.tiktokClientSecret) {
      // Return default trends if TikTok not configured
      return NextResponse.json({
        hashtags: [
          '#fyp',
          '#foryou',
          '#viral',
          '#trending',
          '#explore',
          '#tiktokmademebuyit',
          '#aesthetic',
          '#grwm',
          '#storytime',
          '#dance'
        ]
      });
    }

    // Initialize TikTok client
    const tiktokClient = new TikTokClient({
      client_id: user.tiktokClientId,
      client_secret: user.tiktokClientSecret
    });

    // Get trending hashtags
    const hashtags = await tiktokClient.getTrendingHashtags();

    return NextResponse.json({ hashtags });

  } catch (error) {
    console.error('TikTok trends error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TikTok trends' },
      { status: 500 }
    );
  }
}