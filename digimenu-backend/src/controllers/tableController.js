import asyncHandler from 'express-async-handler';
import Table from '../models/Table.js';
import Restaurant from '../models/Restaurant.js';
import generateQRCode from '../utils/qrCode.js';

/**
 * @swagger
 * /tables/add:
 *   post:
 *     summary: Add a new table (Admin only)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['Trống', 'Đang sử dụng']
 *     responses:
 *       201:
 *         description: Table created
 *       400:
 *         description: Bad request
 *       403:
 *         description: Admin access required
 */
const addTable = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Create new table
  const table = await Table.create({
    restaurantId: req.user.restaurantId,
    status: status || 'Trống',
  });

  // Populate restaurant for response
  const populatedTable = await Table.findById(table._id)
    .populate('restaurantId', 'name')
    .populate('currentOrder', 'totalAmount status');

  res.status(201).json({
    success: true,
    data: populatedTable,
  });
});

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Get all tables (Public)
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: List of tables
 */
const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find()
    .populate('restaurantId', 'name')
    .populate('currentOrder', 'totalAmount status');

  res.status(200).json({
    success: true,
    count: tables.length,
    data: tables,
  });
});

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Get a table by ID (Public)
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table details
 *       404:
 *         description: Table not found
 */
const getTableById = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id)
    .populate('restaurantId', 'name')
    .populate('currentOrder', 'totalAmount status');

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  res.status(200).json({
    success: true,
    data: table,
  });
});

/**
 * @swagger
 * /tables/update/{id}:
 *   put:
 *     summary: Update a table (Admin only)
 *     tags: [Tables]
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
 *                 enum: ['Trống', 'Đang sử dụng']
 *               currentOrder:
 *                 type: string
 *     responses:
 *       200:
 *         description: Table updated
 *       404:
 *         description: Table not found
 *       403:
 *         description: Admin access required
 */
const updateTable = asyncHandler(async (req, res) => {
  const { status, currentOrder } = req.body;

  const table = await Table.findById(req.params.id);
  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  // Check if table belongs to the user's restaurant
  if (table.restaurantId.toString() !== req.user.restaurantId.toString()) {
    res.status(403);
    throw new Error('Table does not belong to your restaurant');
  }

  // Update fields
  if (status) table.status = status;
  if (currentOrder !== undefined) table.currentOrder = currentOrder || null;

  await table.save();

  // Populate restaurant for response
  const populatedTable = await Table.findById(table._id)
    .populate('restaurantId', 'name')
    .populate('currentOrder', 'totalAmount status');

  res.status(200).json({
    success: true,
    data: populatedTable,
  });
});

/**
 * @swagger
 * /tables/delete/{id}:
 *   delete:
 *     summary: Delete a table (Admin only)
 *     tags: [Tables]
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
 *         description: Table deleted
 *       404:
 *         description: Table not found
 *       403:
 *         description: Admin access required
 */
const deleteTable = asyncHandler(async (req, res) => {
  const table = await Table.findById(req.params.id);
  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  // Check if table belongs to the user's restaurant
  if (table.restaurantId.toString() !== req.user.restaurantId.toString()) {
    res.status(403);
    throw new Error('Table does not belong to your restaurant');
  }

  // Check if table is in use
  if (table.status === 'Đang sử dụng' || table.currentOrder) {
    res.status(400);
    throw new Error('Cannot delete a table that is in use');
  }

  // Delete QR image from Cloudinary if exists
  if (table.qrImageUrl) {
    try {
      const publicId = table.qrImageUrl
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(
        'Failed to delete QR image from Cloudinary:',
        error.message
      );
    }
  }

  await table.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Table deleted',
  });
});

/**
 * @swagger
 * /tables/scan/{restaurantSlug}/{tableSlug}:
 *   get:
 *     summary: Scan a table QR code (Public)
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: restaurantSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tableSlug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table information
 *       404:
 *         description: Table not found
 */
const scanTable = asyncHandler(async (req, res) => {
  const { restaurantSlug, tableSlug } = req.params;

  const table = await Table.findOne({
    slug: tableSlug,
    'restaurantId.slug': restaurantSlug,
  }).populate('restaurantId', 'name');

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  res.status(200).json({
    success: true,
    data: {
      tableNumber: `Bàn ${table.tableNumber}`,
      restaurantName: table.restaurantId.name,
      status: table.status,
      qrCode: table.qrCode,
    },
  });
});

export {
  addTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  scanTable,
};
