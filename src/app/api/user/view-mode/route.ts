/**
 * GET/POST /api/user/view-mode
 * Get or update user's view mode preference
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// For demo purposes, we'll use a fixed userId
// In production, this would come from session/auth
const DEMO_USER_ID = "demo-user-001";

export async function GET() {
  try {
    let prefs = await prisma.userPreferences.findUnique({
      where: { userId: DEMO_USER_ID },
    });

    // Create default if doesn't exist
    if (!prefs) {
      prefs = await prisma.userPreferences.create({
        data: {
          userId: DEMO_USER_ID,
          viewMode: "vision",
        },
      });
    }

    return NextResponse.json({
      success: true,
      viewMode: prefs.viewMode,
    });
  } catch (error) {
    console.error("View mode fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch view mode" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { viewMode } = body;

    if (!viewMode || !["vision", "stripe", "linear", "tiktok"].includes(viewMode)) {
      return NextResponse.json(
        { error: "Invalid view mode" },
        { status: 400 }
      );
    }

    const prefs = await prisma.userPreferences.upsert({
      where: { userId: DEMO_USER_ID },
      update: { viewMode },
      create: {
        userId: DEMO_USER_ID,
        viewMode,
      },
    });

    return NextResponse.json({
      success: true,
      viewMode: prefs.viewMode,
      message: "View mode updated",
    });
  } catch (error) {
    console.error("View mode update error:", error);
    return NextResponse.json(
      { error: "Failed to update view mode" },
      { status: 500 }
    );
  }
}

