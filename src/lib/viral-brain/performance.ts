import { db } from "@/src/lib/db"

export class PerformanceEngine {
  async record(metrics: any) {
    return db.performanceSnapshot.create({
      data: { metrics },
    })
  }

  async last7Days() {
    const items = await db.performanceSnapshot.findMany({
      orderBy: { timestamp: "desc" },
      take: 7,
    })

    return items.reverse()
  }
}

