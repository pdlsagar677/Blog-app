// app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ObjectId } from "mongodb";

// Helper function to check if string is a valid ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// GET - Get single blog by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params
    const { id } = await context.params;
    
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

    // Build query based on whether id is ObjectId or custom string
    let query: any = {};
    
    if (isValidObjectId(id)) {
      query._id = new ObjectId(id);
    } else {
      // If it's a custom ID string
      query.id = id; // Assuming you have an 'id' field
    }

    // Fetch blog by ID
    const blog = await db.collection("blogs").findOne(query);

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      blog: {
        id: blog._id ? blog._id.toString() : blog.id,
        title: blog.title,
        content: blog.content,
        authorId: blog.authorId,
        authorName: blog.authorName,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }
    }, { status: 200 });
  } catch (err) {
    console.error("Get blog error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update blog
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params
    const { id } = await context.params;
    
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

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 });
    }

    // Build query
    let query: any = {};
    
    if (isValidObjectId(id)) {
      query._id = new ObjectId(id);
    } else {
      query.id = id;
    }

    // Check if blog exists and user is the author
    const blog = await db.collection("blogs").findOne(query);

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    // Check authorization - only author can update
    if (blog.authorId !== session.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized to edit this blog" }, { status: 403 });
    }

    // Build update query
    let updateQuery: any = {};
    
    if (isValidObjectId(id)) {
      updateQuery._id = new ObjectId(id);
    } else {
      updateQuery.id = id;
    }

    // Update blog
    const result = await db.collection("blogs").updateOne(
      updateQuery,
      {
        $set: {
          title,
          content,
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: "Failed to update blog" }, { status: 400 });
    }

    // Fetch updated blog
    const updatedBlog = await db.collection("blogs").findOne(query);

    return NextResponse.json({ 
      success: true, 
      blog: {
        id: updatedBlog!._id ? updatedBlog!._id.toString() : updatedBlog!.id,
        title: updatedBlog!.title,
        content: updatedBlog!.content,
        authorId: updatedBlog!.authorId,
        authorName: updatedBlog!.authorName,
        createdAt: updatedBlog!.createdAt,
        updatedAt: updatedBlog!.updatedAt
      }
    }, { status: 200 });
  } catch (err) {
    console.error("Update blog error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete blog
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Unwrap params
    const { id } = await context.params;
    
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

    // Build query
    let query: any = {};
    
    if (isValidObjectId(id)) {
      query._id = new ObjectId(id);
    } else {
      query.id = id;
    }

    // Check if blog exists and user is the author
    const blog = await db.collection("blogs").findOne(query);

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    // Check authorization - only author can delete
    if (blog.authorId !== session.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized to delete this blog" }, { status: 403 });
    }

    // Build delete query
    let deleteQuery: any = {};
    
    if (isValidObjectId(id)) {
      deleteQuery._id = new ObjectId(id);
    } else {
      deleteQuery.id = id;
    }

    // Delete blog
    const result = await db.collection("blogs").deleteOne(deleteQuery);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Blog deleted successfully" 
    }, { status: 200 });
  } catch (err) {
    console.error("Delete blog error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}