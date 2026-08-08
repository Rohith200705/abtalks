import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController';

const router = Router();

// GET / -> getLeaderboard
router.get('/', getLeaderboard);

export default router;
