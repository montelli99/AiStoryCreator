import { NextRequest, NextResponse } from "next/server"
import { DescriptionEngine } from "@/lib/viral-brain/descriptions"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { script, strength } = await req.json()

    const engine = new DescriptionEngine()
    const description = engine.generate(strength, script)

    const saved = await db.descriptionGroup.create({
      data: {
        strength,
        description,
      },
    })

    return NextResponse.json(saved)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

