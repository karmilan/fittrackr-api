import { Router } from 'express';
import * as profileController from './profile.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', profileController.getProfile);
// Use PUT for upsert behavior
router.put('/', profileController.updateProfile);

export default router;
