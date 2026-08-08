import { Request, Response } from 'express';
import { z } from 'zod';
import { Challenge } from '../models/Challenge';
import { Submission } from '../models/Submission';
import { executeCode } from '../services/codeExecutionService';
import { updateProgressAfterSubmission, getOrCreateProgress } from '../services/progressService';
import { checkAndCreateAchievements } from '../services/achievementService';
import * as githubService from '../services/githubService';
import * as linkedinService from '../services/linkedinService';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

const submitSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  language: z.string().min(1, 'Language is required'),
  code: z.string().min(1, 'Code is required'),
});

export const submitSolution = async (req: Request, res: Response) => {
  try {
    const parsed = submitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors,
      });
    }

    const { challengeId, language, code } = parsed.data;
    const userId = DEMO_USER_ID;

    // Get the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Run all test cases
    const testCases = challenge.testCases.map((tc: any) => ({
      input: tc.input,
      expected: tc.expectedOutput,
    }));

    const executionResult = await executeCode(code, language, testCases);

    const allPassed = executionResult.testResults.every((r) => r.passed);
    const testCasesPassed = executionResult.testResults.filter((r) => r.passed).length;
    const totalTestCases = executionResult.testResults.length;

    // Determine submission status
    let submissionStatus: 'accepted' | 'wrong_answer' | 'compile_error' | 'runtime_error' | 'timeout';
    if (executionResult.status === 'compilation_error') {
      submissionStatus = 'compile_error';
    } else if (executionResult.status === 'timeout') {
      submissionStatus = 'timeout';
    } else if (!allPassed) {
      submissionStatus = 'wrong_answer';
    } else {
      submissionStatus = 'accepted';
    }

    // Create submission record
    const submission = await Submission.create({
      userId,
      challengeId,
      day: challenge.day,
      language,
      code,
      status: submissionStatus,
      testCasesPassed,
      totalTestCases,
      runtime: executionResult.runtime,
      memory: executionResult.memory,
    });

    // Build structured result
    const result: any = {
      submission: {
        id: submission._id,
        status: submissionStatus,
        testCasesPassed,
        totalTestCases,
        runtime: executionResult.runtime,
        memory: executionResult.memory,
      },
      testResults: executionResult.testResults,
      xp: { status: 'pending', xpEarned: 0 },
      streak: { status: 'pending', current: 0 },
      achievements: [],
      github: { status: 'pending' },
      linkedin: { status: 'pending' },
    };

    // If all test cases passed, update progress, check achievements, attempt social integrations
    if (allPassed) {
      const difficulty = challenge.difficulty.toLowerCase();
      const xpValues: Record<string, number> = { easy: 50, medium: 100, hard: 200 };
      const xpEarned = xpValues[difficulty] || 50;

      try {
        const progress = await updateProgressAfterSubmission(userId, challengeId, {
          challengeId,
          challengeTitle: challenge.title,
          difficulty: challenge.difficulty,
          day: challenge.day,
          language,
          xpEarned,
        });

        result.xp = {
          status: 'earned',
          xpEarned,
          totalXp: progress.totalXp || progress.xp || 0,
        };
        result.streak = {
          status: 'updated',
          current: progress.currentStreak || progress.streak || 0,
          longest: progress.longestStreak || 0,
        };

        // Check and create achievements
        const progressData = {
          completedDays: progress.completedDays || [],
          currentStreak: progress.currentStreak || progress.streak || 0,
          longestStreak: progress.longestStreak || 0,
          totalXp: progress.totalXp || progress.xp || 0,
          githubCommits: progress.githubCommits || 0,
          completedChallenges: progress.completedChallenges || progress.totalSolved || 0,
        };

        const newAchievements = await checkAndCreateAchievements(
          userId,
          {
            challengeId,
            challengeTitle: challenge.title,
            difficulty: challenge.difficulty,
            day: challenge.day,
            language,
            xpEarned,
          },
          progressData
        );

        result.achievements = newAchievements;

        // Attempt GitHub commit
        try {
          const githubResult = await githubService.commitSolution(
            userId,
            challenge.day,
            challenge.title,
            code,
            language
          );
          result.github = { status: 'committed', ...githubResult };
          submission.githubCommitId = githubResult.commitSha;
          await submission.save();
        } catch (githubError: any) {
          result.github = { status: 'failed', error: githubError.message };
        }

        // Attempt LinkedIn publish
        try {
          const linkedinResult = await linkedinService.publishAchievement(userId, {
            day: challenge.day,
            challengeTitle: challenge.title,
            difficulty: challenge.difficulty,
            xpEarned,
            streak: progress.currentStreak || progress.streak || 0,
            totalXp: progress.totalXp || progress.xp || 0,
            language,
          });
          result.linkedin = { ...linkedinResult, status: 'published' as string };
        } catch (linkedinError: any) {
          result.linkedin = { status: 'failed', error: linkedinError.message };
        }
      } catch (progressError: any) {
        result.xp = { status: 'failed', error: progressError.message };
        result.streak = { status: 'failed', error: progressError.message };
      }
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
