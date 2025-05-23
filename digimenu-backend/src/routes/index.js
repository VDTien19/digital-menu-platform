import express from 'express';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import menuItemRoutes from './menuItemRoutes.js';
import tableRoutes from './tableRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu-items', menuItemRoutes);
router.use('/tables', tableRoutes);
router.use('/orders', orderRoutes);

export default router;
