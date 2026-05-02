import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  submitRatingValidator,
  validateResult,
} from '../validators/rating.validator.js';
import ratingController from '../controllers/rating.controller.js';

const router = Router();

router.post(
  '/',
  authenticate,
  submitRatingValidator,
  validateResult,
  ratingController.submitRating
);

export default router;
