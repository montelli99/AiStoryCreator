// NOTE: This runs on a server only.
import { db } from "@/lib/db"

let schedulerStarted = false

export function startScheduler() {
  if (schedulerStarted) return
  schedulerStarted = true

  console.log("[Scheduler] Starting automated scheduler...")

  setInterval(async () => {
    try {
      const nowISO = new Date().toISOString().split("T")[0]

      const dueItems = await db.schedule.findMany({
        where: {
          date: nowISO,
          status: "scheduled"
        }
      })

      if (dueItems.length === 0) return

      for (const item of dueItems) {
        console.log("[Scheduler] Processing scheduled item:", item.id)

        try {
          // PLACEHOLDER FOR REAL TIKTOK POSTING
          // In Phase 4 we replace this with actual TikTok API calls
          console.log(`[Scheduler] Posting "${item.title}" to TikTok...`)

          await db.schedule.update({
            where: { id: item.id },
            data: { status: "posted" }
          })

          console.log("[Scheduler] Schedule update:", {
            id: item.id,
            status: "posted"
          })

        } catch (err) {
          console.error("[Scheduler] Failed to post:", err)

          await db.schedule.update({
            where: { id: item.id },
            data: { status: "failed" }
          })

          console.log("[Scheduler] Schedule update:", {
            id: item.id,
            status: "failed"
          })
        }
      }
    } catch (err) {
      console.error("[Scheduler] Error running scheduler loop:", err)
    }
  }, 60_000) // every 60 seconds
}