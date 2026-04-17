import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = Router();

// All cart routes are protected
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:paintingId', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:paintingId', removeCartItem);

export default router;
