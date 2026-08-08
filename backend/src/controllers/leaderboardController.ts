import { Request, Response } from 'express';
import { Progress } from '../models/Progress';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const topUsers = await Progress.find()
      .sort({ xp: -1 })
      .limit(20)
      .populate('userId', 'name username avatar');

    res.json({ leaderboard: topUsers });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
