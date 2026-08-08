import mongoose from 'mongoose';

export interface IUser {
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  college?: string;
  graduationYear?: number;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String,
  },
  college: {
    type: String,
  },
  graduationYear: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
