import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User, Session } from "@/models/User-model";

export async function POST(req: NextRequest) {
  const { emailOrUsername, password } = await req.json();

  if (!emailOrUsername || !password) {
    return NextResponse.json(
      { success: false, error: "Both fields are required" },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectDB();

    // Find user by username or email
    const user = await db.collection<User>("users").findOne({
      $or: [
        { username: { $regex: `^${emailOrUsername}$`, $options: "i" } },
        { email: { $regex: `^${emailOrUsername}$`, $options: "i" } },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Create session
    const newSession: Session = {
      token: Math.random().toString(36).slice(2) + Date.now().toString(36),
      userId: user.id,
      createdAt: new Date(),
    };
    await db.collection<Session>("sessions").insertOne(newSession);

    // Return token & user data
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      contact: user.contact,
    };

    return NextResponse.json(
      { success: true, token: newSession.token, user: userData },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
