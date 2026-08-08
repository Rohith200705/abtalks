import { Router } from 'express';
import { getAchievements } from '../controllers/achievementController';

const router = Router();

// GET / -> getAchievements
router.get('/', getAchievements);

export default router;
