import { Router } from 'express';
import { runCode, visualizeCode } from '../controllers/codeController';

const router = Router();

// POST /run -> runCode
router.post('/run', runCode);

// POST /visualize -> visualizeCode
router.post('/visualize', visualizeCode);

export default router;
