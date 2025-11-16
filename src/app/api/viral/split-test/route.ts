import { NextRequest, NextResponse } from "next/server"
import { SplitTestEngine } from "@/lib/viral-brain/split-test"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { name, variantA, variantB } = await req.json()

    const engine = new SplitTestEngine()
    const test = await engine.create(name, variantA, variantB)

    return NextResponse.json(test)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function GET() {
  try {
    const tests = await db.splitTest.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tests)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

