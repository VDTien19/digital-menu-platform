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
 *               tableId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: ['QR', 'Tiền mặt']
 *               phoneNumber:
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
  const { tableId, items, paymentMethod, phoneNumber, notes } = req.body;

  // Validate required fields
  if (!tableId || !items || items.length === 0) {
    res.status(400);
    throw new Error('Table ID and items are required');
  }

  // Check table
  const table = await Table.findById(tableId);
  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }
  if (table.restaurantId.toString() !== req.user?.restaurantId?.toString()) {
    res.status(403);
    throw new Error('Table does not belong to your restaurant');
  }

  // Validate items and calculate totalCost
  let totalCost = 0;
  for (const item of items) {
    const menuItem = await MenuItem.findById(item.itemId);
    if (!menuItem) {
      res.status(404);
      throw new Error(`Menu item ${item.itemId} not found`);
    }
    if (!item.quantity || item.quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }
    if (!item.price || item.price < 0) {
      res.status(400);
      throw new Error('Price must be a positive number');
    }
    totalCost += item.quantity * item.price;
  }

  // Create new order
  const order = await Order.create({
    restaurantId: req.user.restaurantId,
    tableId,
    items,
    totalCost,
    paymentMethod: paymentMethod || null,
    paymentConfirmed: paymentMethod ? true : false,
    phoneNumber: phoneNumber || null,
    notes: notes || '',
  });

  // Update table
  table.currentOrder = order._id;
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
  const orders = await Order.find({ restaurantId: req.user.restaurantId })
    .populate('tableId', 'name tableNumber')
    .populate('items.itemId', 'name price');

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
    restaurantId: req.user.restaurantId,
  })
    .populate('tableId', 'name tableNumber')
    .populate('items.itemId', 'name price');

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
 *               paymentMethod:
 *                 type: string
 *                 enum: ['QR', 'Tiền mặt']
 *               paymentConfirmed:
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
  const { status, paymentMethod, paymentConfirmed, notes } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    restaurantId: req.user.restaurantId,
  });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update fields
  if (status) order.status = status;
  if (paymentMethod) order.paymentMethod = paymentMethod;
  if (paymentConfirmed !== undefined) order.paymentConfirmed = paymentConfirmed;
  if (notes !== undefined) order.notes = notes;

  await order.save();

  // Update table status if order is completed
  if (status === 'Đã thanh toán') {
    const table = await Table.findById(order.tableId);
    if (table) {
      table.currentOrder = null;
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
    restaurantId: req.user.restaurantId,
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update table
  const table = await Table.findById(order.tableId);
  if (table) {
    table.currentOrder = null;
    table.status = 'Trống';
    await table.save();
  }

  res.status(200).json({
    success: true,
    message: 'Order deleted',
  });
});

export { addOrder, getOrders, getOrderById, updateOrder, deleteOrder };
