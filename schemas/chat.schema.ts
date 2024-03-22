import * as mongoose from 'mongoose';
import { User, UserDocument } from './user.schema';

export interface Chat extends mongoose.Document {
  msg: string;
  user: UserDocument;
  createdAt: Date;
}

export const ChatSchema = new mongoose.Schema({
  msg: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export interface ChatDocument extends Chat, mongoose.Document {}
