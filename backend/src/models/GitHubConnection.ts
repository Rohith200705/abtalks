import mongoose from 'mongoose';

export interface IGitHubConnection {
  userId: mongoose.Types.ObjectId;
  githubUserId?: number;
  username?: string;
  repositoryName?: string;
  repositoryUrl?: string;
  encryptedAccessToken?: string;
  connectedAt?: Date;
  lastSyncAt?: Date;
}

const gitHubConnectionSchema = new mongoose.Schema<IGitHubConnection>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  githubUserId: {
    type: Number,
  },
  username: {
    type: String,
  },
  repositoryName: {
    type: String,
  },
  repositoryUrl: {
    type: String,
  },
  encryptedAccessToken: {
    type: String,
  },
  connectedAt: {
    type: Date,
  },
  lastSyncAt: {
    type: Date,
  },
});

export const GitHubConnection = mongoose.models.GitHubConnection || mongoose.model<IGitHubConnection>('GitHubConnection', gitHubConnectionSchema);
