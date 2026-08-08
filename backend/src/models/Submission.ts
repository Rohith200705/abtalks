import mongoose from 'mongoose';

export interface ISubmission {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  day: number;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'timeout';
  testCasesPassed?: number;
  totalTestCases?: number;
  runtime?: number;
  memory?: number;
  executionTrace?: any;
  githubCommitId?: string;
  submittedAt: Date;
}

const submissionSchema = new mongoose.Schema<ISubmission>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'wrong_answer', 'compile_error', 'runtime_error', 'timeout'],
  },
  testCasesPassed: {
    type: Number,
  },
  totalTestCases: {
    type: Number,
  },
  runtime: {
    type: Number,
  },
  memory: {
    type: Number,
  },
  executionTrace: {
    type: mongoose.Schema.Types.Mixed,
  },
  githubCommitId: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

submissionSchema.index({ userId: 1, challengeId: 1 });

export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', submissionSchema);
