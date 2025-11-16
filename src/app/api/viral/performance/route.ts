import { NextRequest, NextResponse } from "next/server"
import { PerformanceEngine } from "@/lib/viral-brain/performance"

export async function POST(req: NextRequest) {
  try {
    const { metrics } = await req.json()

    const engine = new PerformanceEngine()
    const saved = await engine.record(metrics)

    return NextResponse.json(saved)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function GET() {
  try {
    const engine = new PerformanceEngine()
    const data = await engine.last7Days()

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

