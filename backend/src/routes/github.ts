import { Router } from 'express';
import {
  connectGitHub,
  handleCallback,
  createRepository,
  commitSolution,
  getGitHubStatus,
} from '../controllers/githubController';

const router = Router();

// GET /connect -> connectGitHub
router.get('/connect', connectGitHub);

// GET /callback -> handleCallback
router.get('/callback', handleCallback);

// POST /create-repository -> createRepository
router.post('/create-repository', createRepository);

// POST /commit -> commitSolution
router.post('/commit', commitSolution);

// GET /status -> getGitHubStatus
router.get('/status', getGitHubStatus);

export default router;
