import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';

const router = Router();

router.patch('/:id', subscriptionController.update);

export default router;