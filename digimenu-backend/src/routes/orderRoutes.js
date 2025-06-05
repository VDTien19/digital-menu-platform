import express from 'express';
import {
  addOrder,
  getPendingOrders,
  approveOrder,
} from '../controllers/orderController.js';
import { protect, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add').post(addOrder); // Public API
router.route('/pending').get(protect, staffOrAdmin, getPendingOrders); // Staff or Admin only
router.route('/:id/approve').put(protect, staffOrAdmin, approveOrder); // Staff or Admin only

export default router;