import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Check if demo user already exists
    const existingUser = await db.user.findUnique({
      where: { email: 'demo@aicreator.com' }
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Demo user already exists',
        user: {
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role
        }
      });
    }

    // Create demo user
    const passwordHash = await bcrypt.hash('demo123456', 12);

    const demoUser = await db.user.create({
      data: {
        email: 'demo@aicreator.com',
        passwordHash,
        name: 'Demo User',
        role: 'admin' // Give admin role for demo
      }
    });

    // Create a demo API key
    const apiKey = await db.apiKey.create({
      data: {
        key: `zcs_demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        userId: demoUser.id,
        label: 'Demo API Key',
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Demo user created successfully',
      user: {
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role
      },
      apiKey: {
        key: apiKey.key,
        label: apiKey.label
      }
    });

  } catch (error) {
    console.error('Demo user creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo user' },
      { status: 500 }
    );
  }
}