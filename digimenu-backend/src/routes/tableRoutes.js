import express from 'express';
import {
  addTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
} from '../controllers/tableController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/add').post(protect, admin, addTable);
router.route('/').get(getTables);
router.route('/:id').get(getTableById);
router.route('/update/:id').put(protect, admin, updateTable);
router.route('/delete/:id').delete(protect, admin, deleteTable);

export default router;