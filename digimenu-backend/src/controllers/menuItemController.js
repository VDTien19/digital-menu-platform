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
 *               category_id:
 *                 type: string
 *                 description: Optional, leave empty for unclassified
 *     responses:
 *       201:
 *         description: Menu item created
 *       400:
 *         description: Bad request
 *       403:
 *         description: Admin access required
 */
const addMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, category_id } = req.body;

  // Validate required fields
  if (!name || !price) {
    res.status(400);
    throw new Error('Name and price are required');
  }

  // Check if restaurant_id exists in req.user
  if (!req.user || !req.user.restaurant_id) {
    res.status(400);
    throw new Error('Restaurant ID not found in user session');
  }

  // Validate category_id if provided
  if (category_id) {
    const category = await Category.findById(category_id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    if (category.restaurant_id.toString() !== req.user.restaurant_id.toString()) {
      res.status(403);
      throw new Error('Category does not belong to your restaurant');
    }
  }

  // Handle image upload to Cloudinary
  let image_url = null;
  if (req.file) {
    try {
      const publicId = `menu-item-${req.user.restaurant_id}-${Date.now()}`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'menu-items',
        public_id: publicId,
        fetch_format: 'auto',
        quality: 'auto',
        crop: 'auto',
        gravity: 'auto',
      });

      if (!result.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      image_url = result.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  // Create new menu item
  const menuItem = await MenuItem.create({
    restaurant_id: req.user.restaurant_id,
    name,
    price,
    description,
    image_url,
    category_id: category_id || null,
  });

  // Populate category and restaurant for response
  const populatedMenuItem = await MenuItem.findById(menuItem._id)
    .populate('category_id', 'name')
    .populate('restaurant_id', 'name');

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
    .populate('category_id', 'name')
    .populate('restaurant_id', 'name');

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
    .populate('category_id', 'name')
    .populate('restaurant_id', 'name');

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
 * /menu-items/category/{category_id}:
 *   get:
 *     summary: Get menu items by category (Public)
 *     tags: [MenuItems]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID (use "null" to get unclassified items)
 *     responses:
 *       200:
 *         description: List of menu items in the category
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid category ID
 */
const getMenuItemsByCategory = asyncHandler(async (req, res) => {
  const { category_id } = req.params;

  // Validate category_id format
  if (!category_id) {
    res.status(400);
    throw new Error('Category ID is required');
  }

  let queryCondition;

  // Handle case where category_id is "null" (unclassified items)
  if (category_id.toLowerCase() === 'null') {
    queryCondition = { category_id: null };
  } else {
    // Validate if category_id is a valid ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(category_id);
    if (!isValidObjectId) {
      res.status(400);
      throw new Error('Invalid category ID format');
    }

    // Check if category exists
    const category = await Category.findById(category_id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    queryCondition = { category_id };
  }

  // Find menu items by category_id (or null)
  const menuItems = await MenuItem.find(queryCondition)
    .populate('category_id', 'name')
    .populate('restaurant_id', 'name');

  res.status(200).json({
    success: true,
    count: menuItems.length,
    data: menuItems,
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
 *               category_id:
 *                 type: string
 *                 description: Optional, leave empty for unclassified
 *     responses:
 *       200:
 *         description: Menu item updated
 *       404:
 *         description: Menu item not found
 *       403:
 *         description: Admin access required
 */
const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, price, description, category_id } = req.body;

  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Check if menu item belongs to the user's restaurant
  if (menuItem.restaurant_id.toString() !== req.user.restaurant_id.toString()) {
    res.status(403);
    throw new Error('Menu item does not belong to your restaurant');
  }

  // Validate category_id if provided
  if (category_id) {
    const category = await Category.findById(category_id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    if (category.restaurant_id.toString() !== req.user.restaurant_id.toString()) {
      res.status(403);
      throw new Error('Category does not belong to your restaurant');
    }
    menuItem.category_id = category_id;
  } else if (category_id === '' || category_id === undefined) {
    menuItem.category_id = null;
  }

  // Handle image upload to Cloudinary
  if (req.file) {
    try {
      // Delete old image from Cloudinary if exists
      if (menuItem.image_url) {
        const publicId = menuItem.image_url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`menu-items/${publicId}`);
      }

      // Upload new image
      const publicId = `menu-item-${req.user.restaurant_id}-${Date.now()}`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'menu-items',
        public_id: publicId,
        fetch_format: 'auto',
        quality: 'auto',
        crop: 'auto',
        gravity: 'auto',
      });

      if (!result.secure_url) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      menuItem.image_url = result.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (error) {
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
    .populate('category_id', 'name')
    .populate('restaurant_id', 'name');

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
  if (menuItem.restaurant_id.toString() !== req.user.restaurant_id.toString()) {
    res.status(403);
    throw new Error('Menu item does not belong to your restaurant');
  }

  // Delete image from Cloudinary if exists
  if (menuItem.image_url) {
    const publicId = menuItem.image_url.split('/').pop().split('.')[0];
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
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
};