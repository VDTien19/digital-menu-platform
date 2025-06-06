import asyncHandler from 'express-async-handler';
import Invoice from '../models/Invoice.js';
import Restaurant from '../models/Restaurant.js';
import { getNextSequenceValue, getInvoiceNumber } from '../utils/counterLogic.js';

const createInvoice = asyncHandler(async (req, orderGroup) => {
  // Kiểm tra xem Invoice đã tồn tại cho order_group_id này chưa
  const existingInvoice = await Invoice.findOne({ order_group_id: orderGroup._id });
  if (existingInvoice) {
    return existingInvoice; // Trả về Invoice hiện tại, không tạo mới
  }

  // Lấy thông tin nhà hàng từ restaurant_id
  const restaurant = await Restaurant.findById(orderGroup.restaurant_id).select('name address');
  if (!restaurant) {
    throw new Error('Restaurant not found for this OrderGroup');
  }

  // Sinh invoice_number
  const sequenceValue = await getNextSequenceValue('invoice_number');
  const invoiceNumber = getInvoiceNumber(sequenceValue);

  // Tạo Invoice mới
  const invoice = new Invoice({
    invoice_number: invoiceNumber,
    order_group_id: orderGroup._id,
    table_id: orderGroup.table_id,
    total_cost: orderGroup.total_cost || 0,
    payment_method: orderGroup.payment_method || 'Không xác định',
    payment_date: orderGroup.payment_date || new Date(),
    restaurant_info: {
      name: restaurant.name,
      address: restaurant.address,
    },
  });

  // Lưu vào database
  await invoice.save();
  return invoice;
});

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices (Staff or Admin only)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: table_id
 *         schema:
 *           type: string
 *         description: Filter by table ID
 *       - in: query
 *         name: payment_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by payment date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of invoices
 *       403:
 *         description: Staff or Admin access required
 */
const getInvoices = asyncHandler(async (req, res) => {
  const { table_id, payment_date } = req.query;

  let query = {};

  // Lọc theo table_id nếu có
  if (table_id) {
    query.table_id = table_id;
  }

  // Lọc theo payment_date nếu có (YYYY-MM-DD)
  if (payment_date) {
    const start = new Date(payment_date);
    const end = new Date(payment_date);
    end.setDate(end.getDate() + 1); // Kết thúc ngày
    query.payment_date = { $gte: start, $lt: end };
  }

  const invoices = await Invoice.find(query)
    .populate('table_id', 'name table_number')
    .populate('order_group_id', 'orders total_cost')
    .sort({ payment_date: -1 });

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
});

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Get invoice by ID (Staff or Admin only)
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 *       403:
 *         description: Staff or Admin access required
 */
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('table_id', 'name table_number')
    .populate({
      path: 'order_group_id',
      populate: {
        path: 'orders',
        populate: { path: 'items.item_id', select: 'name price' },
      },
    });

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

export { createInvoice, getInvoices, getInvoiceById };