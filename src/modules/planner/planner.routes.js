import { Router } from 'express';
import * as plannerController from './planner.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Apply authentication to all planner routes
router.use(authenticate);

// POST /api/planner/generate
router.post('/generate', plannerController.generateDailyPlan);

// GET /api/planner?date=YYYY-MM-DD
router.get('/', plannerController.getDailyPlan);

export default router;
