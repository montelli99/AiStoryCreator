import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const characters = await db.character.findMany({
      orderBy: [
        { ethnicity: 'asc' },
        { baseAge: 'asc' },
        { variant: 'asc' }
      ],
      include: {
        _count: {
          select: {
            contents: true
          }
        }
      }
    });

    return NextResponse.json({ characters });

  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
}