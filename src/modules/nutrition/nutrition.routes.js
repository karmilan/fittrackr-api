import { Router } from 'express';
import * as nutritionController from './nutrition.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', nutritionController.getNutritionLogs);
router.post('/', nutritionController.logNutrition);
router.get('/summary', nutritionController.getDailySummary);

export default router;
