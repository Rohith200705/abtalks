import { Request, Response } from 'express';
import { z } from 'zod';
import * as linkedinService from '../services/linkedinService';
import { env } from '../config/env';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const connectLinkedIn = async (req: Request, res: Response) => {
  try {
    if (env.LINKEDIN_CLIENT_ID === 'demo' || !env.LINKEDIN_CLIENT_ID) {
      // Demo mode - return demo connect URL
      const demoUrl =
        env.FRONTEND_URL + '/linkedin/callback?code=demo_code_' + DEMO_USER_ID;
      res.json({ url: demoUrl, mode: 'demo' });
      return;
    }

    // Real OAuth - redirect to LinkedIn
    const authUrl =
      'https://www.linkedin.com/oauth/v2/authorization' +
      '?response_type=code' +
      '&client_id=' +
      env.LINKEDIN_CLIENT_ID +
      '&redirect_uri=' +
      encodeURIComponent(env.LINKEDIN_REDIRECT_URI) +
      '&scope=openid%20profile%20w_member_social';

    res.redirect(authUrl);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const result = await linkedinService.connectUser(DEMO_USER_ID, code);
    res.json({ connection: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const publishSchema = z.object({
  day: z.number().optional().default(1),
  challengeTitle: z.string().optional().default('My Solution'),
  difficulty: z.string().optional().default('easy'),
  language: z.string().optional().default('javascript'),
});

export const publishPost = async (req: Request, res: Response) => {
  try {
    const parsed = publishSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors,
      });
    }

    const { day, challengeTitle, difficulty, language } = parsed.data;

    const result = await linkedinService.publishAchievement(DEMO_USER_ID, {
      day,
      challengeTitle,
      difficulty,
      xpEarned: 0,
      streak: 0,
      totalXp: 0,
      language,
    });

    res.json({ post: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLinkedInStatus = async (req: Request, res: Response) => {
  try {
    const status = await linkedinService.getLinkedInStatus(DEMO_USER_ID);
    res.json({ status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
