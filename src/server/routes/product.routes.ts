import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createProduct);
router.put('/:id', protect, authorize('ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('ADMIN'), deleteProduct);

export default router;
