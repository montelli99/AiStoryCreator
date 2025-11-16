import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { getServerSession } from '@/lib/auth';

// POST /api/api-keys/create - Create new API key
export async function POST() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate API key with prefix
    const key = `zcs_${nanoid(48)}`;

    const apiKey = await db.apiKey.create({
      data: {
        key,
        userId: session.user.id,
        label: 'Generated API Key'
      }
    });

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        key: apiKey.key,
        label: apiKey.label,
        createdAt: apiKey.createdAt
      },
      message: 'API key created successfully'
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// GET /api/api-keys - List user's API keys
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const apiKeys = await db.apiKey.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        key: true,
        label: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true
      }
    });

    // Mask the keys for security (show only first 8 and last 4 characters)
    const maskedKeys = apiKeys.map(key => ({
      ...key,
      key: `${key.key.substring(0, 12)}...${key.key.substring(key.key.length - 4)}`,
      hasFullKey: false
    }));

    return NextResponse.json({
      success: true,
      apiKeys: maskedKeys
    });

  } catch (error) {
    console.error('API keys fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}