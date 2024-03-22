import * as mongoose from 'mongoose';
import { User, UserDocument } from './user.schema';

export interface Round extends mongoose.Document {
  points: number;
  multiplier: number;
  user: UserDocument;
  score: number;
  guess: number;
  createdAt: Date;
}

export const RoundSchema = new mongoose.Schema({
  points: { type: Number, required: true },
  multiplier: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, required: true },
  guess: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface RoundDocument extends Round, mongoose.Document {}
