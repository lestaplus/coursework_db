import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

const router = Router();

router.post('/register', userController.register);
router.get('/', userController.getAll);
router.delete('/:id', userController.deleteUser);

router.get('/analytics/revenue', userController.getAnalytics);
router.patch('/subscriptions/:id', userController.updateSubscription);

export default router;