import express from 'express';
import {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add').post(protect, addOrder);
router.route('/').get(protect, admin, getOrders);
router.route('/:id').get(protect, admin, getOrderById);
router.route('/update/:id').put(protect, admin, updateOrder);
router.route('/delete/:id').delete(protect, admin, deleteOrder);

export default router;
