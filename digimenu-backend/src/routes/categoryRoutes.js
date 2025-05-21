import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tạo danh mục mới: /api/categories/add (yêu cầu đăng nhập)
router.post('/add', protect, admin, createCategory);

// Lấy danh sách danh mục: /api/categories/all (không yêu cầu đăng nhập)
router.get('/all', getCategories);

// Lấy thông tin một danh mục: /api/categories/get/:id (không yêu cầu đăng nhập)
router.get('/get/:id', getCategoryById);

// Cập nhật danh mục: /api/categories/update/:id (yêu cầu đăng nhập)
router.put('/update/:id', protect, admin, updateCategory);

// Xóa danh mục: /api/categories/delete/:id (yêu cầu đăng nhập)
router.delete('/delete/:id', protect, admin, deleteCategory);

export default router;
