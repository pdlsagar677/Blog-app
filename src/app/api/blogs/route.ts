import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/store/useBlogStore";

const generateId = () => {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
  );
};

export async function POST(req: NextRequest) {
  try {
    const { title, content, authorId } = await req.json();

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const { db } = await connectDB();

    const newBlog: Blog = {
      id: generateId(),
      title,
      content,
      authorId,
      createdAt: new Date().toISOString(),
    };

    await db.collection<Blog>("blogs").insertOne(newBlog);

    return NextResponse.json(
      { success: true, blog: newBlog },
      { status: 200 }
    );
  } catch (err) {
    console.error("Add blog error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
