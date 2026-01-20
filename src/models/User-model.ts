import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  contact: string;
  createdAt: Date;
}

export interface Session {
  _id?: ObjectId;
  token: string;
  userId: string;
  createdAt: Date;
}
