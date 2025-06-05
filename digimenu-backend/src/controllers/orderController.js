import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Table from '../models/Table.js';
import MenuItem from '../models/MenuItem.js';
import OrderGroup from '../models/OrderGroup.js';

/**
 * @swagger
 * /orders/add:
 *   post:
 *     summary: Add a new order (Public)
 *     tags: [Orders]
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
  const { table_id, items, notes } = req.body;

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

  // Validate items and calculate total_cost
  let total_cost = 0;
  const updatedItems = [];
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
    // Lấy price từ MenuItem
    const price = menuItem.price;
    if (price < 0) {
      res.status(400);
      throw new Error(`Price of menu item ${item.item_id} must be a positive number`);
    }
    // Tính tổng tiền cho item này
    const itemTotal = item.quantity * price;
    total_cost += itemTotal;

    // Thêm price vào item để lưu vào Order
    updatedItems.push({
      item_id: item.item_id,
      quantity: item.quantity,
      price: price,
    });
  }

  // Check or create OrderGroup
  let orderGroup = await OrderGroup.findById(table.current_order_group);
  if (!orderGroup || orderGroup.payment_status === 'Đã thanh toán') {
    orderGroup = await OrderGroup.create({
      restaurant_id: table.restaurant_id,
      table_id,
      payment_status: 'Chưa thanh toán',
    });
    table.current_order_group = orderGroup._id;
    table.status = 'Đang sử dụng';
    await table.save();
  }

  // Create new order
  const order = await Order.create({
    restaurant_id: table.restaurant_id,
    table_id,
    order_group_id: orderGroup._id,
    items: updatedItems,
    total_cost,
    notes: notes || '',
    status: 'Đang chờ', // Default status as per schema
  });

  // Update OrderGroup
  orderGroup.orders.push(order._id);
  orderGroup.total_cost += total_cost;
  await orderGroup.save();

  // Emit WebSocket event
  const io = req.app.get('io');
  const populatedOrder = await Order.findById(order._id)
    .populate('table_id', 'name')
    .populate('items.item_id', 'name price');
  io.emit('new_pending_order', populatedOrder);

  res.status(201).json({
    success: true,
    data: order,
  });
});

/**
 * @swagger
 * /orders/pending:
 *   get:
 *     summary: Get all pending orders for staff (Staff or Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending orders
 *       403:
 *         description: Staff or Admin access required
 */
const getPendingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    restaurant_id: req.user.restaurant_id,
    status: 'Đang chờ',
  })
    .populate('table_id', 'name table_number')
    .populate('items.item_id', 'name price')
    .sort({ createdAt: -1 }); // Newest first

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @swagger
 * /orders/{id}/approve:
 *   put:
 *     summary: Approve an order (Staff or Admin only)
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
 *         description: Order approved
 *       404:
 *         description: Order not found
 *       403:
 *         description: Staff or Admin access required
 */
const approveOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    restaurant_id: req.user.restaurant_id,
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Update order status to "Đã nhận"
  order.status = 'Đã nhận';
  await order.save();

  // Emit WebSocket event
  const io = req.app.get('io');
  const populatedOrder = await Order.findById(order._id)
    .populate('table_id', 'name')
    .populate('items.item_id', 'name price');
  io.emit('order_updated', populatedOrder);

  res.status(200).json({
    success: true,
    data: order,
  });
});

export { addOrder, getPendingOrders, approveOrder };