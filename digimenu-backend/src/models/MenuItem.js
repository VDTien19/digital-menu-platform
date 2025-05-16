import mongoose from 'mongoose';
import slugify from 'slugify';

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
    },
    slug: {
      type: String,
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
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    orderCount: {
      type: Number,
      default: 0,
      min: [0, 'Order count cannot be negative'],
    },
  },
  { timestamps: true }
);

// Tạo slug trước khi lưu
menuItemSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Đảm bảo slug unique trong phạm vi restaurantId
menuItemSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

export default mongoose.model('MenuItem', menuItemSchema);
