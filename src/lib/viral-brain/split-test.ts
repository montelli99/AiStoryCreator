import { db } from "@/src/lib/db"

export class SplitTestEngine {
  async create(name: string, variantA: any, variantB: any) {
    return db.splitTest.create({
      data: { name, variantA, variantB },
    })
  }

  async recordWinner(testId: string, winner: "A" | "B") {
    return db.splitTest.update({
      where: { id: testId },
      data: { winner },
    })
  }
}

