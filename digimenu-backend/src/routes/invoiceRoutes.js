import express from 'express';
import { getInvoices, getInvoiceById } from '../controllers/invoiceController.js';
import { protect, staffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, staffOrAdmin, getInvoices);
router.route('/:id').get(protect, staffOrAdmin, getInvoiceById);

export default router;