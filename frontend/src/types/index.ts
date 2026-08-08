export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  college: string;
  graduationYear: number;
}

export interface Challenge {
  _id: string;
  day: number;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  starterCode: { python: string; javascript: string; cpp: string };
  testCases: { input: string; expectedOutput: string }[];
  solvedPercentage: number;
  order: number;
}

export interface Progress {
  _id: string;
  userId: string;
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
  lastActivityAt: string;
}

export interface Submission {
  _id: string;
  userId: string;
  challengeId: string;
  day: number;
  language: string;
  code: string;
  status: 'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'timeout';
  testCasesPassed: number;
  totalTestCases: number;
  runtime: number;
  memory: number;
  executionTrace: ExecutionStep[];
  githubCommitId: string;
  submittedAt: string;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

export interface CodeRunResult {
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  runtime: number;
  memory: number;
  testResults: TestResult[];
  passed: number;
  total: number;
}

export interface ExecutionStep {
  step: number;
  line: number;
  function: string;
  variables: Record<string, any>;
  structures: Record<string, any>;
  expression?: string;
  value?: any;
}

export interface Achievement {
  _id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  day: number;
  xp: number;
  imageUrl: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  username: string;
  xp: number;
  streak: number;
  totalSolved: number;
  rank: number;
}

export interface GitHubStatus {
  connected: boolean;
  username?: string;
  repositoryUrl?: string;
}

export interface LinkedInStatus {
  connected: boolean;
  mode: string;
}
