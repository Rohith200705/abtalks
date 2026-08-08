import mongoose from 'mongoose';

export interface IAchievement {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description?: string;
  day?: number;
  xp: number;
  imageUrl?: string;
  unlockedAt: Date;
  linkedinPostId?: string;
}

const achievementSchema = new mongoose.Schema<IAchievement>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  day: {
    type: Number,
  },
  xp: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
  linkedinPostId: {
    type: String,
  },
});

export const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', achievementSchema);
