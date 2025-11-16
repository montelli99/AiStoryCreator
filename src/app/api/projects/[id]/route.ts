import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/projects/[id] - Get specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.project.findUnique({
      where: { id: params.id },
      include: {
        character: true,
        contents: {
          where: { type: 'scene' },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Format response to include scenes
    const formattedProject = {
      ...project,
      scenes: project.contents || []
    };

    return NextResponse.json({ project: formattedProject });

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[id] - Create scene or update project
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Handle scene creation
    if (body.type === 'createScene') {
      const { title, description, camera } = body;
      
      const scene = await db.content.create({
        data: {
          title,
          description,
          projectId: params.id,
          type: 'scene',
          status: 'idea',
          fileType: 'video',
          promptCogView: {
            camera: camera || 'medium shot',
            scene: description
          },
          createdAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        scene,
        message: 'Scene created successfully'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in POST /api/projects/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, status, prompt } = await request.json();

    const project = await db.project.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
        prompt,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      project,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.project.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}