/**
 * POST /api/video/create-project
 * Creates a new video project with Director AI planning
 */

import { NextResponse } from 'next/server';
import { videoEngine } from '@/lib/video-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      characterCode,
      characterData,
      product,
      analytics,
      trendData,
    } = body;

    if (!characterCode || !characterData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create project with Director AI
    const project = await videoEngine.createProject({
      characterCode,
      characterData,
      product,
      analytics,
      trendData,
    });

    // Generate assets for all scenes
    await videoEngine.generateAssets(project.id, project);

    // Score all variations
    const scores = await videoEngine.scoreVariations(project.variations);

    // Add scores to variations
    project.variations.forEach(v => {
      const score = scores.get(v.id);
      if (score) {
        v.viralScore = score.overall;
      }
    });

    return NextResponse.json({
      success: true,
      project,
      message: 'Project created and assets generated',
    });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

