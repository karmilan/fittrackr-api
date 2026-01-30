import { Router } from 'express';
import * as nutritionController from './nutrition.controller.js';

const router = Router();

router.get('/', nutritionController.getNutritionLogs);
router.post('/', nutritionController.logNutrition);
router.get('/summary', nutritionController.getDailySummary);

export default router;
