import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

/**
 * @swagger
 * /categories/add:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *               description:
 *                 type: string
 *                 description: Description of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     restaurantId:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Not authorized
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const restaurantId = req.user.restaurantId;

  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }

  if (!restaurantId) {
    res.status(400);
    throw new Error('Restaurant ID not found for this user');
  }

  const categoryExists = await Category.findOne({ name, restaurantId });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists for this restaurant');
  }

  const category = await Category.create({
    name,
    description,
    restaurantId,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * @swagger
 * /categories/all:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       restaurantId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate('restaurantId', 'name');
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

/**
 * @swagger
 * /categories/get/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     restaurantId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *       404:
 *         description: Category not found
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    'restaurantId',
    'name'
  );

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @swagger
 * /categories/update/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     restaurantId:
 *                       type: string
 *       404:
 *         description: Category not found
 *       401:
 *         description: Not authorized
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const restaurantId = req.user.restaurantId;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.restaurantId.toString() !== restaurantId.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this category');
  }

  category.name = name || category.name;
  category.description = description || category.description;

  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    data: updatedCategory,
  });
});

/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Category not found
 *       401:
 *         description: Not authorized
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const restaurantId = req.user.restaurantId;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.restaurantId.toString() !== restaurantId.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this category');
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
