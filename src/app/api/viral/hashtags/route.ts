import { NextRequest, NextResponse } from "next/server"
import { HashtagEngine } from "@/lib/viral-brain/hashtags"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { category } = await req.json()

    const engine = new HashtagEngine()
    const result = await engine.generate(category)

    const saved = await db.hashtagGroup.create({
      data: {
        category,
        tags: result.tags,
        score: result.score,
      },
    })

    return NextResponse.json(saved)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

