import mongoose from 'mongoose';

export interface IExample {
  input: string;
  output: string;
  explanation: string;
}

export interface IStarterCode {
  python: string;
  javascript: string;
  cpp: string;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IChallenge {
  day: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  description: string;
  examples: IExample[];
  constraints: string[];
  starterCode: IStarterCode;
  testCases: ITestCase[];
  solvedPercentage: number;
  order?: number;
}

const exampleSchema = new mongoose.Schema<IExample>(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema<IStarterCode>(
  {
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
    cpp: { type: String, default: '' },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

const challengeSchema = new mongoose.Schema<IChallenge>({
  day: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  topics: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  examples: {
    type: [exampleSchema],
    default: [],
  },
  constraints: {
    type: [String],
    default: [],
  },
  starterCode: {
    type: starterCodeSchema,
    default: () => ({ python: '', javascript: '', cpp: '' }),
  },
  testCases: {
    type: [testCaseSchema],
    default: [],
  },
  solvedPercentage: {
    type: Number,
    default: 0,
  },
  order: {
    type: Number,
  },
});

export const Challenge = mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', challengeSchema);
