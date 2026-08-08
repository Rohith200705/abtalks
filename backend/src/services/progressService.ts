import { Progress } from '../models/Progress';

interface Submission {
  challengeId: string;
  challengeTitle: string;
  difficulty: string;
  day: number;
  language: string;
  xpEarned: number;
}

const XP_VALUES: Record<string, number> = {
  easy: 50,
  medium: 100,
  hard: 200,
};

export const getOrCreateProgress = async (userId: string) => {
  let progress = await Progress.findOne({ userId });
  if (!progress) {
    progress = await Progress.create({
      userId,
      currentDay: 1,
      completedDays: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityAt: null,
      totalXp: 0,
      easyCount: 0,
      mediumCount: 0,
      hardCount: 0,
      githubCommits: 0,
      completedChallenges: 0,
    });
  }
  return progress;
};

export const updateProgressAfterSubmission = async (
  userId: string,
  challengeId: string,
  submission: Submission
) => {
  const progress = await getOrCreateProgress(userId);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const difficulty = submission.difficulty.toLowerCase();
  const xpEarned = XP_VALUES[difficulty] || 50;

  if (!progress.completedDays.includes(submission.day)) {
    progress.completedDays.push(submission.day);
  }

  if (progress.lastActivityAt) {
    const lastActivity = new Date(progress.lastActivityAt);
    const lastDay = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
    const diffDays = Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      progress.currentStreak += 1;
    } else if (diffDays === 0) {
      // Same day, no change to streak
    } else {
      progress.currentStreak = 1;
    }
  } else {
    progress.currentStreak = 1;
  }

  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  progress.totalXp += xpEarned;

  switch (difficulty) {
    case 'easy':
      progress.easyCount += 1;
      break;
    case 'medium':
      progress.mediumCount += 1;
      break;
    case 'hard':
      progress.hardCount += 1;
      break;
  }

  progress.completedChallenges += 1;

  const sortedDays = [...progress.completedDays].sort((a, b) => a - b);
  let nextDay = 1;
  for (const day of sortedDays) {
    if (day === nextDay) {
      nextDay++;
    } else {
      break;
    }
  }
  progress.currentDay = nextDay;

  progress.lastActivityAt = now;

  await progress.save();

  return progress;
};
