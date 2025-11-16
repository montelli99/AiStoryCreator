import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const accounts = await db.tikTokAccount.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: accounts })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { username, followers } = await req.json()

    if (!username) {
      return NextResponse.json(
        { success: false, error: "username is required" },
        { status: 400 }
      )
    }

    const newAccount = await db.tikTokAccount.create({
      data: {
        username,
      },
    })

    return NextResponse.json({ success: true, data: newAccount })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

