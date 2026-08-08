import { Achievement as AchievementModel } from '../models/Achievement';
import { User } from '../models/User';

interface Achievement {
  type: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt: Date;
}

interface Submission {
  challengeId: string;
  challengeTitle: string;
  difficulty: string;
  day: number;
  language: string;
  xpEarned: number;
}

interface Progress {
  completedDays: number[];
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  githubCommits: number;
  completedChallenges: number;
}

const ACHIEVEMENT_DEFINITIONS: Record<string, (submission: Submission, progress: Progress, existingAchievements: string[]) => Achievement | null> = {
  first_challenge: (submission, progress, existing) => {
    if (existing.includes('first_challenge')) return null;
    return {
      type: 'first_challenge',
      title: 'First Steps',
      description: 'Completed your first coding challenge',
      icon: '🎯',
      xpReward: 100,
      unlockedAt: new Date(),
    };
  },
  first_commit: (submission, progress, existing) => {
    if (existing.includes('first_commit')) return null;
    if (progress.githubCommits < 1) return null;
    return {
      type: 'first_commit',
      title: 'Code Commited',
      description: 'Made your first GitHub commit',
      icon: '📦',
      xpReward: 50,
      unlockedAt: new Date(),
    };
  },
  '7_day_streak': (submission, progress, existing) => {
    if (existing.includes('7_day_streak')) return null;
    if (progress.currentStreak < 7) return null;
    return {
      type: '7_day_streak',
      title: 'Week Warrior',
      description: 'Maintained a 7-day coding streak',
      icon: '🔥',
      xpReward: 200,
      unlockedAt: new Date(),
    };
  },
  '10_challenges': (submission, progress, existing) => {
    if (existing.includes('10_challenges')) return null;
    if (progress.completedChallenges < 10) return null;
    return {
      type: '10_challenges',
      title: 'Double Digits',
      description: 'Completed 10 coding challenges',
      icon: '🔟',
      xpReward: 150,
      unlockedAt: new Date(),
    };
  },
  '25_challenges': (submission, progress, existing) => {
    if (existing.includes('25_challenges')) return null;
    if (progress.completedChallenges < 25) return null;
    return {
      type: '25_challenges',
      title: 'Quarter Century',
      description: 'Completed 25 coding challenges',
      icon: '🏆',
      xpReward: 300,
      unlockedAt: new Date(),
    };
  },
  '50_challenges': (submission, progress, existing) => {
    if (existing.includes('50_challenges')) return null;
    if (progress.completedChallenges < 50) return null;
    return {
      type: '50_challenges',
      title: 'Half Century',
      description: 'Completed 50 coding challenges',
      icon: '🥇',
      xpReward: 500,
      unlockedAt: new Date(),
    };
  },
  week_one_complete: (submission, progress, existing) => {
    if (existing.includes('week_one_complete')) return null;
    const firstWeek = [1, 2, 3, 4, 5, 6, 7];
    const completedFirstWeek = firstWeek.every(day => progress.completedDays.includes(day));
    if (!completedFirstWeek) return null;
    return {
      type: 'week_one_complete',
      title: 'Week One Complete',
      description: 'Completed all challenges in the first week',
      icon: '📅',
      xpReward: 250,
      unlockedAt: new Date(),
    };
  },
  '30_day_streak': (submission, progress, existing) => {
    if (existing.includes('30_day_streak')) return null;
    if (progress.currentStreak < 30) return null;
    return {
      type: '30_day_streak',
      title: 'Monthly Master',
      description: 'Maintained a 30-day coding streak',
      icon: '🌟',
      xpReward: 500,
      unlockedAt: new Date(),
    };
  },
  '10_github_commits': (submission, progress, existing) => {
    if (existing.includes('10_github_commits')) return null;
    if (progress.githubCommits < 10) return null;
    return {
      type: '10_github_commits',
      title: 'Open Source Hero',
      description: 'Made 10 GitHub commits',
      icon: '🐙',
      xpReward: 200,
      unlockedAt: new Date(),
    };
  },
  '25_github_commits': (submission, progress, existing) => {
    if (existing.includes('25_github_commits')) return null;
    if (progress.githubCommits < 25) return null;
    return {
      type: '25_github_commits',
      title: 'Code Contributor',
      description: 'Made 25 GitHub commits',
      icon: '💻',
      xpReward: 300,
      unlockedAt: new Date(),
    };
  },
};

export const checkAndCreateAchievements = async (
  userId: string,
  submission: Submission,
  progress: Progress
): Promise<Achievement[]> => {
  const existingAchievements = await AchievementModel.find({ userId });
  const existingTypes = existingAchievements.map((a: any) => a.type);

  const newAchievements: Achievement[] = [];

  for (const [type, checkFn] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
    const achievement = checkFn(submission, progress, existingTypes);
    if (achievement) {
      const savedAchievement = await AchievementModel.create({
        userId,
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        xpReward: achievement.xpReward,
        unlockedAt: achievement.unlockedAt,
      });
      newAchievements.push(savedAchievement);
    }
  }

  return newAchievements;
};
