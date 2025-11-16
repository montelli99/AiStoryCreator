import { db } from "@/lib/db";
import { uploadToTikTok } from "./upload";

export async function processTikTokQueue() {
  const jobs = await db.tikTokUploadQueue.findMany({
    where: { status: "queued" },
    take: 5
  });

  for (const job of jobs) {
    await db.tikTokUploadQueue.update({
      where: { id: job.id },
      data: { status: "processing" }
    });

    try {
      await uploadToTikTok(job.videoId);

      await db.tikTokUploadQueue.update({
        where: { id: job.id },
        data: { status: "done" }
      });
    } catch (err) {
      await db.tikTokUploadQueue.update({
        where: { id: job.id },
        data: {
          status: "failed",
          attempts: { increment: 1 }
        }
      });
    }
  }
}

