import { NextRequest, NextResponse } from "next/server"
import { ViralBrain } from "@/lib/viral-brain/engine"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json()

    const brain = new ViralBrain()
    const insights = await brain.analyzeScript(script)

    const saved = await db.viralInsight.create({
      data: {
        script,
        insights,
      },
    })

    return NextResponse.json(saved)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

