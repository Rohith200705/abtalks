import { Request, Response } from 'express';
import { z } from 'zod';
import { Challenge } from '../models/Challenge';
import { executeCode } from '../services/codeExecutionService';
import { generateExecutionTrace } from '../services/visualizationService';

const DEMO_USER_ID = '65a1b2c3d4e5f6a7b8c9d0e1';

const runCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  challengeId: z.string().min(1, 'Challenge ID is required'),
});

const visualizeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  challengeSlug: z.string().min(1, 'Challenge slug is required'),
});

export const runCode = async (req: Request, res: Response) => {
  try {
    const parsed = runCodeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors,
      });
    }

    const { code, language, challengeId } = parsed.data;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const testCases = challenge.testCases.map((tc: any) => ({
      input: tc.input,
      expected: tc.expectedOutput,
    }));

    const result = await executeCode(code, language, testCases);

    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const visualizeCode = async (req: Request, res: Response) => {
  try {
    const parsed = visualizeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parsed.error.errors,
      });
    }

    const { code, language, challengeSlug } = parsed.data;
    const trace = await generateExecutionTrace(code, language, challengeSlug);

    res.json({ trace });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
