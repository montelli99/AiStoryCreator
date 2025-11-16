import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

// PUT /api/api-keys/[id] - Update API key
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { label, isActive } = await request.json();

    // Check if API key belongs to user
    const existingKey = await db.apiKey.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const updatedKey = await db.apiKey.update({
      where: { id: params.id },
      data: {
        ...(label !== undefined && { label }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({
      success: true,
      apiKey: updatedKey,
      message: 'API key updated successfully'
    });

  } catch (error) {
    console.error('API key update error:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys/[id] - Delete API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if API key belongs to user
    const existingKey = await db.apiKey.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    await db.apiKey.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('API key deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}