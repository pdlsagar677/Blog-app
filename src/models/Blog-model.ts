import { ObjectId } from 'mongodb';

export interface Blog {
  _id?: ObjectId;
  id: string;          
  title: string;
  content: string;
  authorId: string;     
  createdAt: Date;
  updatedAt?: Date;
}
