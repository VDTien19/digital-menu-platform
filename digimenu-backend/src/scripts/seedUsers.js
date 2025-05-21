import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import connectDB from '../config/db.js';

// Đọc file .env
dotenv.config();

const seedData = async () => {
  try {
    // Kết nối MongoDB
    await connectDB();

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Restaurant.deleteMany({});

    // Mã hóa password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Tạo admin trước (tạm thời không có restaurantId)
    const adminData = {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      email: 'admin@restaurant.com',
      phoneNumber: '0909123456',
    };

    // Tạm thời bỏ qua validation để tạo admin
    const admin = new User(adminData);
    await admin.save({ validateBeforeSave: false });

    // Tạo nhà hàng và gán ownerId
    const restaurant = new Restaurant({
      name: 'TKN Pizza',
      ownerId: admin._id,
      address: '123 Đường ABC, Thành Phố Hà Nội',
      phone: '0909123456',
    });
    await restaurant.save();

    // Cập nhật restaurantId cho admin
    admin.restaurantId = restaurant._id;
    await admin.save();

    const hashedPassword2 = await bcrypt.hash('staff1', salt);

    // Tạo nhân viên
    const staff = new User({
      username: 'staff1',
      password: hashedPassword2,
      role: 'staff',
      email: 'staff@restaurant.com',
      phoneNumber: '0909123457',
      restaurantId: restaurant._id,
    });
    await staff.save();

    console.log('Data seeded successfully');
    console.log('Restaurant ID:', restaurant._id.toString());
    console.log('Admin ID:', admin._id.toString());
    console.log('Staff ID:', staff._id.toString());
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
