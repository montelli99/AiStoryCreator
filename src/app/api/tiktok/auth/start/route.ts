import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");

  const url =
    `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${process.env.TIKTOK_CLIENT_KEY}` +
    `&response_type=code` +
    `&scope=user.info.basic,video.upload,video.publish` +
    `&redirect_uri=${encodeURIComponent(process.env.TIKTOK_REDIRECT_URI!)}` +
    `&state=${state}`;

  return NextResponse.redirect(url);
}
