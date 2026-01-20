import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/db';
import { User, Session } from '../../../../models/User-model';

export async function POST(req: NextRequest) {
  const { username, email, password, contact } = await req.json();

  if (!username || !email || !password || !contact) {
    return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
  }

  try {
    const { db } = await connectDB();

    const existingUser = await db.collection<User>('users').findOne({
      $or: [
        { username: { $regex: `^${username}$`, $options: 'i' } },
        { email: { $regex: `^${email}$`, $options: 'i' } }
      ],
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Username or email already exists' }, { status: 400 });
    }

    const passwordHash = bcrypt.hashSync(password, 12);

    const newUser: User = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      username,
      email,
      contact,
      passwordHash,
      createdAt: new Date(),
    };

    const insertResult = await db.collection<User>('users').insertOne(newUser);
    newUser._id = insertResult.insertedId;

    const newSession: Session = {
      token: Math.random().toString(36).slice(2) + Date.now().toString(36),
      userId: newUser.id,
      createdAt: new Date(),
    };

    await db.collection<Session>('sessions').insertOne(newSession);

    return NextResponse.json({ success: true, token: newSession.token }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
