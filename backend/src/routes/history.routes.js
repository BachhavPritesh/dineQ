import express from 'express';
import * as historyController from '../controllers/history.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, historyController.getRestaurantHistory);

router.get('/customer', authenticate, historyController.getCustomerHistory);

export default router;
