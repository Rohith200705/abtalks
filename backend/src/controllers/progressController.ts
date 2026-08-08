import { Request, Response } from 'express';
import { getOrCreateProgress } from '../services/progressService';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const getProgress = async (req: Request, res: Response) => {
  try {
    const progress = await getOrCreateProgress(DEMO_USER_ID);
    res.json({ progress });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
