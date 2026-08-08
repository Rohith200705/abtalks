import mongoose from 'mongoose';

export interface IProgress {
  userId: mongoose.Types.ObjectId;
  currentDay: number;
  completedDays: number[];
  streak: number;
  longestStreak: number;
  xp: number;
  rank: number;
  selectedTrack: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  lastActivityAt?: Date;
}

const progressSchema = new mongoose.Schema<IProgress>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentDay: {
    type: Number,
    default: 1,
  },
  completedDays: {
    type: [Number],
    default: [],
  },
  streak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  xp: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  selectedTrack: {
    type: String,
    default: 'general',
  },
  totalSolved: {
    type: Number,
    default: 0,
  },
  easySolved: {
    type: Number,
    default: 0,
  },
  mediumSolved: {
    type: Number,
    default: 0,
  },
  hardSolved: {
    type: Number,
    default: 0,
  },
  lastActivityAt: {
    type: Date,
  },
});

export const Progress = mongoose.models.Progress || mongoose.model<IProgress>('Progress', progressSchema);
