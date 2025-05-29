import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';

/**
 * @swagger
 * /orders/add:
 *   post:
 *     summary: Add a new order (Public or Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table_id:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               payment_method:
 *                 type: string
 *                 enum: ['QR', 'Tiền mặt']
 *               phone_number:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Bad request
 *       404:
 *         description: Table or menu item not found
 */
const addOrder = asyncHandler(async (req, res) => {
  const { table_id, items, payment_method, phone_number, notes } = req.body;

  // Validate required fields
  if (!table_id || !items || items.length === 0) {
    res.status(400);
    throw new Error('Table ID and items are required');
  }

  // Check table
  const table = await Table.findById(table_id);
  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }
  if (table.restaurant_id.toString() !== req.user?.restaurant_id?.toString()) {
    res.status(403);
    throw new Error('Table does not belong to your restaurant');
  }

  // Validate items and calculate total_cost
  let total_cost = 0;
  for (const item of items) {
    const menuItem = await MenuItem.findById(item.item_id);
    if (!menuItem) {
      res.status(404);
      throw new Error(`Menu item ${item.item_id} not found`);
    }
    if (!item.quantity || item.quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }
    if (!item.price || item.price < 0) {
      res.status(400);
      throw new Error('Price must be a positive number');
    }
    total_cost += item.quantity * item.price;
  }

  // Create new order
  const order = await Order.create({
    restaurant_id: req.user.restaurant_id,
    table_id,
    items,
    total_cost,
    payment_method: payment_method || null,
    payment_confirmed: payment_method ? true : false,
    phone_number: phone_number || null,
    notes: notes || '',
  });

  // Update table
  table.current_order = order._id;
  table.status = 'Đang sử dụng';
  await table.save();

  res.status(201).json({
    success: true,
    data: order,
  });
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for staff (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ restaurant_id: req.user.restaurant_id })
    .populate('table_id', 'name table_number')
    .populate('items.item_id', 'name price');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID (Admin only)
 *     tags: [Orders]
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
 *         description: Order details
 *       404:
 *         description: Order not found
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    restaurant_id: req.user.restaurant_id,
  })
    .populate('table_id', 'name table_number')
    .populate('items.item_id', 'name price');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @swagger
 * /orders/update/{id}:
 *   put:
 *     summary: Update an order (Admin only)
 *     tags: [Orders]
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
 *               status:
 *                 type: string
 *                 enum: ['Chờ xác nhận', 'Đã nhận đơn', 'Đang chế biến', 'Đang lên món', 'Đã thanh toán']
 *               payment_method:
 *                 type: string
 *                 enum: ['QR', 'Tiền mặt']
 *               payment_confirmed:
 *                 type: boolean
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Order not found
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { status, payment_method, payment_confirmed, notes } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    restaurant_id: req.user.restaurant_id,
  });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update fields
  if (status) order.status = status;
  if (payment_method) order.payment_method = payment_method;
  if (payment_confirmed !== undefined) order.payment_confirmed = payment_confirmed;
  if (notes !== undefined) order.notes = notes;

  await order.save();

  // Update table status if order is completed
  if (status === 'Đã thanh toán') {
    const table = await Table.findById(order.table_id);
    if (table) {
      table.current_order = null;
      table.status = 'Trống';
      await table.save();
    }
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @swagger
 * /orders/delete/{id}:
 *   delete:
 *     summary: Delete an order (Admin only)
 *     tags: [Orders]
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
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndDelete({
    _id: req.params.id,
    restaurant_id: req.user.restaurant_id,
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update table
  const table = await Table.findById(order.table_id);
  if (table) {
    table.current_order = null;
    table.status = 'Trống';
    await table.save();
  }

  res.status(200).json({
    success: true,
    message: 'Order deleted',
  });
});

export { addOrder, getOrders, getOrderById, updateOrder, deleteOrder };