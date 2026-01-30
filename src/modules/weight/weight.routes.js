import { Router } from 'express';
import * as weightController from './weight.controller.js';

const router = Router();

router.get('/', weightController.getWeightHistory);
router.post('/', weightController.logWeight);
router.get('/stats', weightController.getWeightStats);

export default router;
