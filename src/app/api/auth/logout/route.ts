import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Session } from "@/models/User-model";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();

    // Delete session by token
    await db.collection<Session>("sessions").deleteOne({ token });

    return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
