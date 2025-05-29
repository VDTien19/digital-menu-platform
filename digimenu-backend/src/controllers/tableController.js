import asyncHandler from 'express-async-handler';
import Table from '../models/Table.js';
import Restaurant from '../models/Restaurant.js';
import generateQRCode from '../utils/qrCode.js';
import cloudinary from '../config/cloudinary.js';

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
    restaurant_id: req.user.restaurant_id,
    status: status || 'Trống',
  });

  // Populate restaurant for response
  const populatedTable = await Table.findById(table._id)
    .populate('restaurant_id', 'name')
    .populate('current_order', 'total_amount status');

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
    .populate('restaurant_id', 'name')
    .populate('current_order', 'total_amount status');

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
    .populate('restaurant_id', 'name')
    .populate('current_order', 'total_amount status');

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
 *               current_order:
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
  const { status, current_order } = req.body;

  const table = await Table.findById(req.params.id);
  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  // Check if table belongs to the user's restaurant
  if (table.restaurant_id.toString() !== req.user.restaurant_id.toString()) {
    res.status(403);
    throw new Error('Table does not belong to your restaurant');
  }

  // Update fields
  if (status) table.status = status;
  if (current_order !== undefined) table.current_order = current_order || null;

  await table.save();

  // Populate restaurant for response
  const populatedTable = await Table.findById(table._id)
    .populate('restaurant_id', 'name')
    .populate('current_order', 'total_amount status');

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
  if (table.restaurant_id.toString() !== req.user.restaurant_id.toString()) {
    res.status(403);
    throw new Error('Table does not belong to your restaurant');
  }

  // Check if table is in use
  if (table.status === 'Đang sử dụng' || table.current_order) {
    res.status(400);
    throw new Error('Cannot delete a table that is in use');
  }

  // Delete QR image from Cloudinary if exists
  if (table.qr_image_url) {
    try {
      const publicId = table.qr_image_url
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
    'restaurant_id.slug': restaurantSlug,
  }).populate('restaurant_id', 'name');

  if (!table) {
    res.status(404);
    throw new Error('Table not found');
  }

  res.status(200).json({
    success: true,
    data: {
      table_number: `Bàn ${table.table_number}`,
      restaurant_name: table.restaurant_id.name,
      status: table.status,
      qr_code: table.qr_code,
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