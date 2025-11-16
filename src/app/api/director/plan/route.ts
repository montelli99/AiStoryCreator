import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

// WebSocket event emitter helper
function emitSocketEvent(event: string, data: any) {
  // This would typically use your WebSocket server
  // For now, we'll log it - in a real implementation
  // you'd emit to connected clients
  console.log(`WebSocket Event: ${event}`, data);
}

// POST /api/director/plan - Generate comprehensive content plan using AI Director
export async function POST(request: NextRequest) {
  try {
    const { projectId, notes } = await request.json();

    // Get project details
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
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

    // Create director job
    const job = await db.jobQueue.create({
      data: {
        type: 'director_plan',
        status: 'pending',
        priority: 2,
        payload: { projectId, notes }
      }
    });

    // Update job status
    await db.jobQueue.update({
      where: { id: job.id },
      data: {
        status: 'processing',
        startedAt: new Date(),
        progress: 10
      }
    });

    // Initialize Z.ai GLM-4.6
    const zai = await ZAI.create();

    // Update progress
    await db.jobQueue.update({
      where: { id: job.id },
      data: { progress: 30 }
    });

    // Generate comprehensive scene plan using GLM-4.6
    const directorPrompt = `
You are an expert cinematic content director for AI-generated videos. Based on the following project information, create a detailed scene breakdown for a compelling video.

PROJECT DETAILS:
Title: ${project.title}
Description: ${project.description}
Additional Notes: ${notes || 'None'}
Existing Scenes: ${project.contents?.length || 0}

Create a structured scene plan with 3-5 scenes. For each scene, provide:
1. Scene title (engaging and descriptive)
2. Scene description (what happens in the scene)
3. Camera direction (shot type, angles, movement)
4. Mood and lighting
5. Prompt for Z.ai image generation
6. Prompt for Z.ai video generation
7. Recommended character type
8. Estimated duration

Return ONLY a JSON object with this structure:
{
  "plan": {
    "title": "Overall video title",
    "description": "Overall video description", 
    "scenes": [
      {
        "title": "Scene title",
        "description": "Scene description",
        "camera": "Camera direction",
        "mood": "Mood and lighting",
        "prompt_image": "Z.ai image prompt",
        "prompt_video": "Z.ai video prompt", 
        "character": "Recommended character",
        "duration": "Estimated duration"
      }
    ]
  }
}

Make it cinematic, engaging, and suitable for AI generation.
`;

    // Update progress
    await db.jobQueue.update({
      where: { id: job.id },
      data: { progress: 60 }
    });

    // Call GLM-4.6 for intelligent scene planning
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert cinematic content director. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: directorPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Update progress
    await db.jobQueue.update({
      where: { id: job.id },
      data: { progress: 80 }
    });

    // Extract and validate the plan
    const planText = completion.choices[0]?.message?.content;
    if (!planText) {
      throw new Error('No response from GLM-4.6');
    }

    let plan;
    try {
      plan = JSON.parse(planText);
    } catch (parseError) {
      throw new Error('Invalid JSON response from GLM-4.6');
    }

    // Validate plan structure
    if (!plan.plan || !plan.plan.scenes || !Array.isArray(plan.plan.scenes)) {
      throw new Error('Invalid plan structure from GLM-4.6');
    }

    // Update progress
    await db.jobQueue.update({
      where: { id: job.id },
      data: { progress: 90 }
    });

    // Store director plan
    await db.directorControl.create({
      data: {
        characterRankings: {},
        shotRankings: {},
        hookRankings: {},
        aestheticRankings: {},
        nextPlan: plan,
        lastAnalysis: new Date(),
        isActive: true
      }
    });

    // AUTO-CREATE SCENES FROM DIRECTOR PLAN
    if (data.plan && data.plan.scenes && Array.isArray(data.plan.scenes)) {
      for (let i = 0; i < data.plan.scenes.length; i++) {
        const scene = data.plan.scenes[i]

        await db.content.create({
          data: {
            projectId,
            type: "scene",
            index: i + 1,
            title: scene.title || `Scene ${i + 1}`,
            description: scene.description || "",
            camera: scene.camera || "",
            mood: scene.mood || "",
            character: scene.character || "",
            promptImage: scene.prompt_image || "",
            promptVideo: scene.prompt_video || "",
            duration: scene.duration || "",
            status: "idea",
            fileType: "video",
            createdAt: new Date()
          }
        })
      }

      // WebSocket broadcast: project updated
      emitSocketEvent("project_update", { 
        projectId,
        scenesCreated: data.plan.scenes.length,
        message: `Auto-created ${data.plan.scenes.length} scenes from Director plan`
      })
    }

    // Complete job
    await db.jobQueue.update({
      where: { id: job.id },
      data: {
        status: 'completed',
        progress: 100,
        completedAt: new Date(),
        result: {
          plan,
          generatedAt: new Date().toISOString(),
          scenesGenerated: plan.plan.scenes.length
        }
      }
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      plan,
      message: `GLM-4.6 Director generated ${plan.plan.scenes.length} scenes`
    });

  } catch (directorError) {
    console.error('GLM-4.6 Director generation error:', directorError);

    // Update job with error
    try {
      await db.jobQueue.update({
        where: { id: job.id },
        data: {
          status: 'failed',
          error: directorError instanceof Error ? directorError.message : 'Unknown error',
          completedAt: new Date()
        }
      });
    } catch (updateError) {
      console.error('Failed to update job with error:', updateError);
    }

    return NextResponse.json(
      {
        error: 'Failed to generate director plan',
        details: directorError instanceof Error ? directorError.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/director/plan - Get current director status and last plan
export async function GET() {
  try {
    // Get last director control state
    const directorControl = await db.directorControl.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    // Get active plans
    const activePlans = await db.content.findMany({
      where: { status: 'idea' },
      include: {
        character: true,
        schedule: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      directorControl,
      activePlans,
      lastAnalysis: directorControl?.lastAnalysis || null,
      nextPlannedContent: activePlans.length
    });

  } catch (error) {
    console.error('Director status error:', error);
    return NextResponse.json(
      { error: 'Failed to get director status' },
      { status: 500 }
    );
  }
}