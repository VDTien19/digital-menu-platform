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

    // Tạo admin trước (tạm thời không có restaurant_id)
    const adminData = {
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      email: 'admin@restaurant.com',
      phone_number: '0909123456',
    };

    const admin = new User(adminData);
    await admin.save();

    // Tạo nhà hàng và gán owner_id
    const restaurant = new Restaurant({
      name: 'TKN Pizza',
      owner_id: admin._id,
      address: '123 Đường ABC, Thành Phố Hà Nội',
      phone: '0909123456',
      banner_url: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/delicious-pizza-banner-design-template-678ba6314fa1113b55bde00ccfb38bcc_screen.jpg?ts=1665562063',
      thumbnail: 'https://st4.depositphotos.com/3316741/22997/i/450/depositphotos_229976142-stock-photo-pizza-with-tomatoes-mozzarella-cheese.jpg',
    });
    await restaurant.save();

    // Cập nhật restaurant_id cho admin
    admin.restaurant_id = restaurant._id;
    await admin.save();

    // Tạo nhân viên
    const staff = new User({
      username: 'staff1',
      password: 'staff1',
      role: 'staff',
      email: 'staff@restaurant.com',
      phone_number: '0909123457',
      restaurant_id: restaurant._id,
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