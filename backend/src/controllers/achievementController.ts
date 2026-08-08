import { Request, Response } from 'express';
import { Achievement } from '../models/Achievement';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await Achievement.find({ userId: DEMO_USER_ID }).sort({
      unlockedAt: -1,
    });

    res.json({ achievements });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
