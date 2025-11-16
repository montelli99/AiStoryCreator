import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const accounts = await db.tikTokAuth.findMany();
    return NextResponse.json({ success: true, accounts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

