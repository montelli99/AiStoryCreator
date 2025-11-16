import { db } from "@/lib/db";

export async function refreshTikTokToken(authId: string) {
  const auth = await db.tikTokAuth.findUnique({ where: { id: authId } });
  if (!auth || !auth.refreshToken) return auth;

  const now = Math.floor(Date.now() / 1000);
  if (auth.expiresAt > now + 60) return auth;

  const res = await fetch("https://open-api.tiktok.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      refresh_token: auth.refreshToken,
      grant_type: "refresh_token"
    })
  });

  const json = await res.json();

  await db.tikTokAuth.update({
    where: { id: authId },
    data: {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + json.expires_in
    }
  });

  return json;
}

