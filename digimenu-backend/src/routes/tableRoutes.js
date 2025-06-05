import express from 'express';
import {
  addTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  getTableOrders,
} from '../controllers/tableController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add').post(protect, admin, addTable);
router.route('/').get(getTables); // Public API
router.route('/:id').get(getTableById); // Public API
router.route('/update/:id').put(protect, admin, updateTable);
router.route('/delete/:id').delete(protect, admin, deleteTable);
router.route('/:tableId/orders').get(getTableOrders); // Public API

export default router;