import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get recent content from database
    const recentContent = await db.content.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        character: {
          select: {
            id: true,
            name: true,
            niche: true,
          }
        }
      }
    });

    // Format the response
    const formattedContent = recentContent.map(content => ({
      id: content.id,
      title: content.title,
      type: content.type,
      status: content.status,
      performance: content.performance || 0,
      createdAt: content.createdAt,
      character: content.character,
      // Add mock metrics for now
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
    }));

    return NextResponse.json({
      success: true,
      recentContent: formattedContent,
    });
  } catch (error) {
    console.error('Error fetching recent content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recent content',
        recentContent: []
      },
      { status: 500 }
    );
  }
}