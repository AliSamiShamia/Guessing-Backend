import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  name: string;
  slug: string;
}

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

export interface UserDocument extends User, mongoose.Document {}
