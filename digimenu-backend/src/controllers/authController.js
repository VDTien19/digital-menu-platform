import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Username and password are required');
  }

  // Explicitly select password for comparison
  const user = await User.findOne({ username }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  console.log('User found:', user);
  console.log('Entered password:', password);
  console.log('Hashed password in DB:', user.password);

  const isMatch = await user.matchPassword(password);
  console.log('Password match:', isMatch);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  console.log('JWT_SECRET in login:', process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user._id, role: user.role, restaurant_id: user.restaurant_id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(200).json({
    success: true,
    token,
  });
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new admin and restaurant
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               email: { type: string }
 *               phone_number: { type: string }
 *               restaurant:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   address: { type: string }
 *                   phone: { type: string }
 *     responses:
 *       201:
 *         description: Admin and restaurant created
 *       400:
 *         description: Bad request
 */
const registerAdmin = asyncHandler(async (req, res) => {
  const { username, password, email, phone_number, restaurant } = req.body;

  if (!username || !password || !email || !phone_number || !restaurant) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (!restaurant.name || !restaurant.address || !restaurant.phone) {
    res.status(400);
    throw new Error('Restaurant name, address, and phone are required');
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('Username already exists');
  }

  const newRestaurant = await Restaurant.create({
    name: restaurant.name,
    address: restaurant.address,
    phone: restaurant.phone,
  });

  const adminUser = await User.create({
    username,
    password,
    email,
    phone_number,
    role: 'admin',
    restaurant_id: newRestaurant._id,
  });

  const token = jwt.sign(
    {
      id: adminUser._id,
      role: adminUser.role,
      restaurant_id: adminUser.restaurant_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.status(201).json({
    success: true,
    token,
  });
});

export { loginUser, registerAdmin };