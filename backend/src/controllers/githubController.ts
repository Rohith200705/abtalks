import { Request, Response } from 'express';
import { z } from 'zod';
import * as githubService from '../services/githubService';
import { env } from '../config/env';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

export const connectGitHub = async (req: Request, res: Response) => {
  try {
    if (env.GITHUB_CLIENT_ID === 'demo' || !env.GITHUB_CLIENT_ID) {
      // Demo mode - return demo connect URL
      const demoUrl =
        env.FRONTEND_URL + '/github/callback?code=demo_code_' + DEMO_USER_ID;
      res.json({ url: demoUrl, mode: 'demo' });
      return;
    }

    // Real OAuth - redirect to GitHub
    const authUrl =
      'https://github.com/login/oauth/authorize' +
      '?client_id=' +
      env.GITHUB_CLIENT_ID +
      '&redirect_uri=' +
      encodeURIComponent(env.GITHUB_REDIRECT_URI) +
      '&scope=repo,user';

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

    const result = await githubService.connectUser(DEMO_USER_ID, code);
    res.json({ connection: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const createRepoSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const createRepository = async (req: Request, res: Response) => {
  try {
    const parsed = createRepoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors,
      });
    }

    const result = await githubService.connectUser(DEMO_USER_ID, 'demo_code');
    res.json({ repository: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const commitSchema = z.object({
  day: z.number().min(1, 'Day must be at least 1'),
  challengeTitle: z.string().min(1, 'Challenge title is required'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
});

export const commitSolution = async (req: Request, res: Response) => {
  try {
    const parsed = commitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors,
      });
    }

    const { day, challengeTitle, code, language } = parsed.data;
    const result = await githubService.commitSolution(
      DEMO_USER_ID,
      day,
      challengeTitle,
      code,
      language
    );

    res.json({ commit: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getGitHubStatus = async (req: Request, res: Response) => {
  try {
    const status = await githubService.getGitHubStatus(DEMO_USER_ID);
    res.json({ status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
