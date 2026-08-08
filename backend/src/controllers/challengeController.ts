import { Request, Response } from 'express';
import { Challenge } from '../models/Challenge';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const getChallenges = async (req: Request, res: Response) => {
  try {
    const { difficulty, topic, search } = req.query;
    const filter: any = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (topic) {
      filter.topics = { $in: [topic] };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const challenges = await Challenge.find(filter).sort({ day: 1 });
    res.json({ challenges, total: challenges.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getChallengeById = async (req: Request, res: Response) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.json({ challenge });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getChallengeByDay = async (req: Request, res: Response) => {
  try {
    const day = parseInt(String(req.params.day), 10);
    if (isNaN(day)) {
      return res.status(400).json({ error: 'Invalid day parameter' });
    }
    const challenge = await Challenge.findOne({ day });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found for day ' + day });
    }
    res.json({ challenge });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
