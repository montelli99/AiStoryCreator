import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/trends - Get all trends
export async function GET() {
  try {
    const trends = await db.trend.findMany({
      where: { isActive: true },
      orderBy: { popularity: 'desc' },
      take: 50
    });

    return NextResponse.json({ trends });

  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}

// POST /api/trends - Create new trend
export async function POST(request: NextRequest) {
  try {
    const { title, description, type, popularity, metadata } = await request.json();

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    const trend = await db.trend.create({
      data: {
        title,
        description,
        type,
        popularity: popularity || 0,
        metadata,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    return NextResponse.json({
      success: true,
      trend,
      message: 'Trend created successfully'
    });

  } catch (error) {
    console.error('Error creating trend:', error);
    return NextResponse.json(
      { error: 'Failed to create trend' },
      { status: 500 }
    );
  }
}