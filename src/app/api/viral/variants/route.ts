import { NextRequest, NextResponse } from "next/server"
import { VariantEngine } from "@/lib/viral-brain/variants"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json()

    const engine = new VariantEngine()
    const variants = engine.generate(script)

    const created = await Promise.all(
      variants.map((v) =>
        db.videoVariant.create({
          data: {
            baseScript: script,
            variantType: v.type,
            output: v,
          },
        })
      )
    )

    return NextResponse.json(created)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

