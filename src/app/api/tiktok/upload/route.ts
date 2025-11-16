import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const video = await db.tikTokVideo.create({
      data: {
        userId: body.userId,
        authId: body.authId,
        fileUrl: body.fileUrl,
        description: body.description,
        hashtags: body.hashtags,
        status: "pending"
      }
    });

    await db.tikTokUploadQueue.create({
      data: {
        videoId: video.id,
        authId: body.authId,
        mode: body.mode,
        scheduleAt: body.scheduleAt ?? null,
        status: "queued"
      }
    });

    return NextResponse.json({ success: true, videoId: video.id });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
