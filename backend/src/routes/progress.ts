import { Router } from 'express';
import { getProgress } from '../controllers/progressController';

const router = Router();

// GET / -> getProgress
router.get('/', getProgress);

export default router;
