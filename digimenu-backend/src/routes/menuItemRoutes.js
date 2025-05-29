import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  addMenuItem,
  getMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuItemController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getMenuItems); // Lấy danh sách món ăn
router.get('/:id', getMenuItemById); // Lấy chi tiết món ăn theo ID
router.get('/category/:category_id', getMenuItemsByCategory); // Lấy danh sách món ăn theo danh mục

// Admin-only routes (require authentication and admin role)
router.post('/add', protect, admin, upload.single('image'), addMenuItem); // Thêm món ăn mới
router.put(
  '/update/:id',
  protect,
  admin,
  upload.single('image'),
  updateMenuItem
); // Cập nhật món ăn
router.delete('/delete/:id', protect, admin, deleteMenuItem); // Xóa món ăn

export default router;