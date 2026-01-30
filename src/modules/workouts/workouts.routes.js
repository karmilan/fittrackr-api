import { Router } from 'express';
import * as workoutController from './workouts.controller.js';

const router = Router();

router.get('/', workoutController.getWorkouts);
router.post('/', workoutController.logWorkout);

export default router;
