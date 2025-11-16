import { processTikTokQueue } from "@/lib/tiktok/queue";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await processTikTokQueue();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

