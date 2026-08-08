import { Router } from 'express';
import {
  connectLinkedIn,
  handleCallback,
  publishPost,
  getLinkedInStatus,
} from '../controllers/linkedinController';

const router = Router();

// GET /connect -> connectLinkedIn
router.get('/connect', connectLinkedIn);

// GET /callback -> handleCallback
router.get('/callback', handleCallback);

// POST /publish -> publishPost
router.post('/publish', publishPost);

// GET /status -> getLinkedInStatus
router.get('/status', getLinkedInStatus);

export default router;
