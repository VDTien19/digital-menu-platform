import express from 'express';
import {
  getOrderGroups,
  updateOrderGroup,
} from '../controllers/orderGroupController.js';
import { protect, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, staffOrAdmin, getOrderGroups); // Staff or Admin only
router.route('/:id').put(protect, staffOrAdmin, updateOrderGroup); // Staff or Admin only

export default router;