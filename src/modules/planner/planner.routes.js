import { Router } from 'express';
import * as plannerController from './planner.controller.js';

const router = Router();

// POST /api/planner/generate
router.post('/generate', plannerController.generateDailyPlan);

// GET /api/planner?date=YYYY-MM-DD
router.get('/', plannerController.getDailyPlan);

export default router;
