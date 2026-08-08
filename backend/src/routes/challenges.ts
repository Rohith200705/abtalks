import { Router } from 'express';
import {
  getChallenges,
  getChallengeById,
  getChallengeByDay,
} from '../controllers/challengeController';

const router = Router();

// GET / -> getChallenges (list all, supports query params: difficulty, topic, search)
router.get('/', getChallenges);

// GET /day/:day -> getChallengeByDay (must come before /:id)
router.get('/day/:day', getChallengeByDay);

// GET /:id -> getChallengeById
router.get('/:id', getChallengeById);

export default router;
