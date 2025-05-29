import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    image_url: {
      type: String,
      trim: true,
      default: null,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // Cho phép null (chưa phân loại)
    },
    order_count: {
      type: Number,
      default: 0,
      min: [0, 'Order count cannot be negative'],
    },
  },
  { timestamps: true }
);

// Đảm bảo name unique trong phạm vi restaurant_id
menuItemSchema.index({ restaurant_id: 1, name: 1 }, { unique: true });

export default mongoose.model('MenuItem', menuItemSchema);