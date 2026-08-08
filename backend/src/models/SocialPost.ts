import mongoose from 'mongoose';

export interface ISocialPost {
  userId: mongoose.Types.ObjectId;
  achievementId?: mongoose.Types.ObjectId;
  platform: 'github' | 'linkedin';
  content?: string;
  mediaUrl?: string;
  status: 'pending' | 'published' | 'demo_published' | 'failed';
  externalPostId?: string;
  publishedAt?: Date;
  error?: string;
}

const socialPostSchema = new mongoose.Schema<ISocialPost>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
  },
  platform: {
    type: String,
    required: true,
    enum: ['github', 'linkedin'],
  },
  content: {
    type: String,
  },
  mediaUrl: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'demo_published', 'failed'],
    default: 'pending',
  },
  externalPostId: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  error: {
    type: String,
  },
});

export const SocialPost = mongoose.models.SocialPost || mongoose.model<ISocialPost>('SocialPost', socialPostSchema);
