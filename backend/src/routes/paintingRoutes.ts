import { Router } from 'express';
import {
  getPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting,
} from '../controllers/paintingController';
import { protect, adminOnly } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getPaintings);
router.get('/:id', getPaintingById);

// Admin-only routes
router.post('/', protect, adminOnly, upload.single('image'), createPainting);
router.put('/:id', protect, adminOnly, upload.single('image'), updatePainting);
router.delete('/:id', protect, adminOnly, deletePainting);

export default router;
