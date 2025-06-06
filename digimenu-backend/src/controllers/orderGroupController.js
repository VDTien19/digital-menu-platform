import asyncHandler from 'express-async-handler';
import OrderGroup from '../models/OrderGroup.js';
import Table from '../models/Table.js';
import { createInvoice } from './invoiceController.js';
import Invoice from '../models/Invoice.js'; // Thêm để populate

/**
 * @swagger
 * /order-groups:
 *   get:
 *     summary: Get all order groups for staff (Staff or Admin only)
 *     tags: [OrderGroups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: payment_status
 *         schema:
 *           type: string
 *           enum: ['Chưa thanh toán', 'Đã thanh toán']
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: List of order groups
 *       403:
 *         description: Staff or Admin access required
 */
const getOrderGroups = asyncHandler(async (req, res) => {
  const { payment_status } = req.query;

  let query = {
    restaurant_id: req.user.restaurant_id,
  };

  if (payment_status) {
    query.payment_status = payment_status;
  }

  const orderGroups = await OrderGroup.find(query)
    .populate('table_id', 'name table_number')
    .populate({
      path: 'orders',
      populate: { path: 'items.item_id', select: 'name price' },
    })
    .sort(payment_status === 'Đã thanh toán' ? { payment_date: -1 } : { createdAt: -1 });

  // For tab 2 ("Đã nhận"): Only include OrderGroups with at least one order having status "Đã nhận"
  let filteredOrderGroups = orderGroups;
  if (payment_status === 'Chưa thanh toán') {
    filteredOrderGroups = orderGroups.filter(orderGroup =>
      orderGroup.orders.some(order => order.status === 'Đã nhận')
    );
  }

  res.status(200).json({
    success: true,
    count: filteredOrderGroups.length,
    data: filteredOrderGroups,
  });
});

/**
 * @swagger
 * /order-groups/{id}:
 *   put:
 *     summary: Update an order group (e.g., mark as paid) (Staff or Admin only)
 *     tags: [OrderGroups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_method:
 *                 type: string
 *                 enum: ['QR', 'Tiền mặt']
 *     responses:
 *       200:
 *         description: Order group updated
 *       404:
 *         description: Order group not found
 *       403:
 *         description: Staff or Admin access required
 */
const updateOrderGroup = asyncHandler(async (req, res) => {
  const io = req.app.get('io'); // Lấy io ngay từ đầu để dùng trong các trường hợp lỗi

  try {
    const { payment_method } = req.body;

    const orderGroup = await OrderGroup.findOne({
      _id: req.params.id,
      restaurant_id: req.user.restaurant_id,
    });

    if (!orderGroup) {
      // Phát sự kiện error_notification
      io.emit('error_notification', {
        error_type: 'OrderGroupNotFound',
        message: 'Order group not found',
        related_id: req.params.id,
        timestamp: new Date().toISOString(),
      });
      res.status(404);
      throw new Error('Order group not found');
    }

    // Lưu trạng thái cũ để kiểm tra
    const oldPaymentStatus = orderGroup.payment_status;

    // Update payment status and method
    if (payment_method) {
      orderGroup.payment_method = payment_method;
      orderGroup.payment_status = 'Đã thanh toán';
      orderGroup.payment_date = new Date();
    }

    await orderGroup.save();

    // Reset table
    const table = await Table.findById(orderGroup.table_id);
    if (table) {
      const previousStatus = table.status; // Lưu trạng thái cũ
      table.current_order_group = null;
      table.status = 'Trống';
      await table.save();

      // Phát sự kiện table_status_updated
      io.emit('table_status_updated', {
        table_id: table._id,
        name: table.name,
        table_number: table.name, // name là số bàn trong schema
        status: table.status,
        previous_status: previousStatus,
        timestamp: new Date().toISOString(),
      });
    }

    // Phát sự kiện order_group_updated trước
    const populatedOrderGroup = await OrderGroup.findById(orderGroup._id)
      .populate('table_id', 'name')
      .populate({
        path: 'orders',
        populate: { path: 'items.item_id', select: 'name price' },
      });
    io.emit('order_group_updated', populatedOrderGroup);

    // Tạo Invoice nếu trạng thái mới là "Đã thanh toán" và trạng thái cũ không phải
    let invoice;
    if (orderGroup.payment_status === 'Đã thanh toán' && oldPaymentStatus !== 'Đã thanh toán') {
      try {
        invoice = await createInvoice(req, orderGroup);
      } catch (invoiceError) {
        // Phát sự kiện error_notification nếu tạo Invoice thất bại
        io.emit('error_notification', {
          error_type: 'InvoiceCreationFailed',
          message: invoiceError.message || 'Failed to create invoice',
          related_id: orderGroup._id.toString(),
          timestamp: new Date().toISOString(),
        });
        throw new Error('Failed to create invoice');
      }
    }

    // Phát sự kiện invoice_created sau khi tạo Invoice
    if (invoice) {
      const populatedInvoice = await Invoice.findById(invoice._id)
        .populate('table_id', 'name table_number');
      io.emit('invoice_created', {
        _id: populatedInvoice._id,
        invoice_number: populatedInvoice.invoice_number,
        table_id: populatedInvoice.table_id,
        total_cost: populatedInvoice.total_cost,
        payment_date: populatedInvoice.payment_date,
      });
    }

    res.status(200).json({
      success: true,
      data: orderGroup,
    });
  } catch (error) {
    // Phát sự kiện error_notification cho các lỗi tổng quát
    io.emit('error_notification', {
      error_type: 'GeneralError',
      message: error.message || 'An unexpected error occurred',
      related_id: req.params.id || 'N/A',
      timestamp: new Date().toISOString(),
    });
    throw error; // Để asyncHandler xử lý lỗi
  }
});

export { getOrderGroups, updateOrderGroup };