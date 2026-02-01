import { Router } from 'express';
import * as workoutController from './workouts.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', workoutController.getWorkouts);
router.post('/', workoutController.logWorkout);

export default router;
