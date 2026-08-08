import { Request, Response } from 'express';
import { User } from '../models/User';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const getProfile = async (req: Request, res: Response) => {
  try {
    let user = await User.findById(DEMO_USER_ID);

    if (!user) {
      user = await User.create({
        _id: DEMO_USER_ID,
        name: 'Demo User',
        username: 'demouser',
        email: 'demo@abtalks.com',
        avatar: '',
        bio: 'Participating in the ABTalks 60-day coding challenge!',
      });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
