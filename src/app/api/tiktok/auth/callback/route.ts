import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Exchange code for token
  const res = await fetch("https://open-api.tiktok.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.TIKTOK_REDIRECT_URI
    })
  });

  const data = await res.json();

  if (!data.access_token) {
    return NextResponse.json({ error: data }, { status: 400 });
  }

  // Fetch account info
  const userInfo = await fetch(
    "https://open-api.tiktok.com/v2/user/info/?fields=open_id,display_name",
    { headers: { Authorization: `Bearer ${data.access_token}` } }
  ).then((r) => r.json());

  const accountType =
    data.scope.includes("video.publish") ? "business" : "creator";

  await db.tikTokAuth.create({
    data: {
      userId: "default",
      accountName: userInfo.data.display_name,
      accountType,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? null,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in
    }
  });

  return NextResponse.redirect("/accounts");
}

