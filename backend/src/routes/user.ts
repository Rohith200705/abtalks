import { Router } from 'express';
import { getProfile } from '../controllers/userController';

const router = Router();

// GET /profile -> getProfile
router.get('/profile', getProfile);

export default router;
