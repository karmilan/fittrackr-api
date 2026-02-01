import { Router } from 'express';
import * as weightController from './weight.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', weightController.getWeightHistory);
router.post('/', weightController.logWeight);
router.get('/stats', weightController.getWeightStats);

export default router;
