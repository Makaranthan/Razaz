import express from 'express';
import { createCheckoutSession, getAllOrders, updateOrderStatus, getMyOrders } from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

// All order routes are protected
router.use(protect);

router.post('/checkout', createCheckoutSession);
router.get('/myorders', getMyOrders);

// Admin routes
router.get('/', authorize('ADMIN'), getAllOrders);
router.put('/:id/status', authorize('ADMIN'), updateOrderStatus);

export default router;
