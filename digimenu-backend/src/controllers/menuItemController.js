import asyncHandler from 'express-async-handler';
import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';
import Restaurant from '../models/Restaurant.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * @swagger
 * /menu-items/add:
 *   post:
 *     summary: Add a new menu item (Admin only)
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Menu item created
 *       400:
 *         description: Bad request
 *       403:
 *         description: Admin access required
 */
const addMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, categoryId } = req.body;

  // Validate required fields
  if (!name || !price || !categoryId) {
    res.status(400);
    throw new Error('Name, price, and categoryId are required');
  }

  // Check if category exists and belongs to the same restaurant
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  if (category.restaurantId.toString() !== req.user.restaurantId.toString()) {
    res.status(403);
    throw new Error('Category does not belong to your restaurant');
  }

  // Handle image upload to Cloudinary
  let imageUrl = null;
  if (req.file) {
    try {
      const publicId = `menu-item-${req.user.restaurantId}-${Date.now()}`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'menu-items',
        public_id: publicId,
        // Optimize: auto format and quality
        fetch_format: 'auto',
        quality: 'auto',
        // Transform: auto-crop with gravity, no fixed width/height
        crop: 'auto',
        gravity: 'auto',
      });

      if (!result.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      imageUrl = result.secure_url;

      // Delete the local file after uploading to Cloudinary
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (error) {
      // Delete the local file if upload fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Create new menu item
  const menuItem = await MenuItem.create({
    restaurantId: req.user.restaurantId,
    name,
    price,
    description,
    imageUrl,
    categoryId,
  });

  // Populate category and restaurant for response
  const populatedMenuItem = await MenuItem.findById(menuItem._id)
    .populate('categoryId', 'name')
    .populate('restaurantId', 'name');

  res.status(201).json({
    success: true,
    data: populatedMenuItem,
  });
});

/**
 * @swagger
 * /menu-items:
 *   get:
 *     summary: Get all menu items (Public)
 *     tags: [MenuItems]
 *     responses:
 *       200:
 *         description: List of menu items
 */
const getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find()
    .populate('categoryId', 'name')
    .populate('restaurantId', 'name');

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
  });
});

/**
 * @swagger
 * /menu-items/{id}:
 *   get:
 *     summary: Get a menu item by ID (Public)
 *     tags: [MenuItems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Menu item not found
 */
const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id)
    .populate('categoryId', 'name')
    .populate('restaurantId', 'name');

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  res.status(200).json({
    success: true,
    data: menuItem,
  });
});

/**
 * @swagger
 * /menu-items/update/{id}:
 *   put:
 *     summary: Update a menu item (Admin only)
 *     tags: [MenuItems]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item updated
 *       404:
 *         description: Menu item not found
 *       403:
 *         description: Admin access required
 */
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, categoryId } = req.body;

  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Check if menu item belongs to the user's restaurant
  if (menuItem.restaurantId.toString() !== req.user.restaurantId.toString()) {
    res.status(403);
    throw new Error('Menu item does not belong to your restaurant');
  }

  // If categoryId is provided, validate it
  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    if (category.restaurantId.toString() !== req.user.restaurantId.toString()) {
      res.status(403);
      throw new Error('Category does not belong to your restaurant');
    }
    menuItem.categoryId = categoryId;
  }

  // Handle image upload to Cloudinary
  if (req.file) {
    try {
      // Delete old image from Cloudinary if exists
      if (menuItem.imageUrl) {
        const publicId = menuItem.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`menu-items/${publicId}`);
      }

      // Upload new image
      const publicId = `menu-item-${req.user.restaurantId}-${Date.now()}`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'menu-items',
        public_id: publicId,
        // Optimize: auto format and quality
        fetch_format: 'auto',
        quality: 'auto',
        // Transform: auto-crop with gravity, no fixed width/height
        crop: 'auto',
        gravity: 'auto',
      });

      if (!result.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      menuItem.imageUrl = result.secure_url;

      // Delete the local file after uploading to Cloudinary
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (error) {
      // Delete the local file if upload fails
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Update fields
  if (name) menuItem.name = name;
  if (price) menuItem.price = price;
  if (description !== undefined) menuItem.description = description;

  await menuItem.save();

  // Populate category and restaurant for response
  const populatedMenuItem = await MenuItem.findById(menuItem._id)
    .populate('categoryId', 'name')
    .populate('restaurantId', 'name');

  res.status(200).json({
    success: true,
    data: populatedMenuItem,
  });
});

/**
 * @swagger
 * /menu-items/delete/{id}:
 *   delete:
 *     summary: Delete a menu item (Admin only)
 *     tags: [MenuItems]
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
 *         description: Menu item deleted
 *       404:
 *         description: Menu item not found
 *       403:
 *         description: Admin access required
 */
const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Check if menu item belongs to the user's restaurant
  if (menuItem.restaurantId.toString() !== req.user.restaurantId.toString()) {
    res.status(403);
    throw new Error('Menu item does not belong to your restaurant');
  }

  // Delete image from Cloudinary if exists
  if (menuItem.imageUrl) {
    const publicId = menuItem.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`menu-items/${publicId}`);
  }

  await menuItem.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Menu item deleted',
  });
});

export {
  addMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};
