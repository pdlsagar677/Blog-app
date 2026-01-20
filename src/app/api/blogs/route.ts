import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/store/useBlogStore";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectDB();

    // Validate session
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    // Fetch all blogs, newest first
    const blogs: Blog[] = await db
      .collection<Blog>("blogs")
      .find({}) // <-- remove authorId filter
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, blogs }, { status: 200 });
  } catch (err) {
    console.error("Fetch blogs error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
