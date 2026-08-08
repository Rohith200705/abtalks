import { Router } from 'express';
import { submitSolution } from '../controllers/submissionController';

const router = Router();

// POST /submit -> submitSolution
router.post('/submit', submitSolution);

export default router;
