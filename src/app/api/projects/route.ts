import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await db.project.findMany({
      include: {
        character: {
          select: {
            code: true,
            ethnicity: true,
            baseAge: true,
            aestheticType: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const { title, description, characterId, type, prompt } = await request.json();

    if (!title || !characterId) {
      return NextResponse.json(
        { error: 'Title and character ID are required' },
        { status: 400 }
      );
    }

    // Check if character exists
    const character = await db.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      );
    }

    const project = await db.project.create({
      data: {
        title,
        description,
        characterId,
        type: type || 'video',
        prompt,
        status: 'draft'
      }
    });

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}