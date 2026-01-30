import { Router } from 'express';
import * as profileController from './profile.controller.js';

const router = Router();

router.get('/', profileController.getProfile);
// Use PUT for upsert behavior
router.put('/', profileController.updateProfile);

export default router;
