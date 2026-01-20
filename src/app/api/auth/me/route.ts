import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Session, User } from "@/models/User-model";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();

    // Find session
    const session = await db.collection<Session>("sessions").findOne({ token });
    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    // Find user
    const user = await db.collection<User>("users").findOne({ id: session.userId });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      contact: user.contact,
    };

    return NextResponse.json({ success: true, user: userData }, { status: 200 });
  } catch (err) {
    console.error("Get me error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
