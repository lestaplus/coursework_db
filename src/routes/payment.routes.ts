import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

router.get('/analytics/revenue', paymentController.getAnalytics);
router.get('/', paymentController.getAll);

export default router;