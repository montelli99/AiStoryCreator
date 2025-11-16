import { db } from "@/lib/db";
import { refreshTikTokToken } from "./refresh";

export async function uploadToTikTok(videoId: string) {
  const video = await db.tikTokVideo.findUnique({ where: { id: videoId } });
  if (!video) return null;

  const auth = await refreshTikTokToken(video.authId);

  // Upload video file
  const upload = await fetch(
    "https://open-api.tiktok.com/v2/video/upload/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        video_url: video.fileUrl
      })
    }
  );

  const uploaded = await upload.json();

  // Auto-post for business accounts
  if (auth.accountType === "business") {
    const posted = await fetch(
      "https://open-api.tiktok.com/v2/video/publish/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          video_id: uploaded.data.video.video_id,
          text: `${video.description} ${video.hashtags.join(" ")}`
        })
      }
    );

    const result = await posted.json();

    await db.tikTokPostLog.create({
      data: {
        videoId,
        authId: video.authId,
        mode: "auto",
        success: true,
        response: result
      }
    });

    return result;
  }

  // Creator accounts → Draft only
  await db.tikTokPostLog.create({
    data: {
      videoId,
      authId: video.authId,
      mode: "draft",
      success: true,
      response: uploaded
    }
  });

  return uploaded;
}

