import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET → return all scheduled items
export async function GET() {
  try {
    const items = await db.schedule.findMany({
      orderBy: { date: "asc" }
    })

    return NextResponse.json({ items })
  } catch (err) {
    console.error("GET /api/scheduler error:", err)
    return NextResponse.json({ error: "Failed to load schedule" }, { status: 500 })
  }
}

// POST → create schedule entry
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { date, title } = body

    if (!date || !title) {
      return NextResponse.json(
        { error: "date and title are required" },
        { status: 400 }
      )
    }

    const item = await db.schedule.create({
      data: {
        date,
        title,
        status: "scheduled"
      }
    })

    return NextResponse.json({ item })
  } catch (err) {
    console.error("POST /api/scheduler error:", err)
    return NextResponse.json({ error: "Failed to create schedule" }, { status: 500 })
  }
}

// PATCH → update schedule entry
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, title, status } = body

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const item = await db.schedule.update({
      where: { id },
      data: { title, status }
    })

    return NextResponse.json({ item })
  } catch (err) {
    console.error("PATCH /api/scheduler error:", err)
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
  }
}

// DELETE → remove schedule entry
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    await db.schedule.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /api/scheduler error:", err)
    return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 })
  }
}