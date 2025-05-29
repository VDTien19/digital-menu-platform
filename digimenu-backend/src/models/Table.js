import mongoose from 'mongoose';
import slugify from 'slugify';
import generateQRCode from '../utils/qrCode.js';

const tableSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    name: {
      type: String,
      required: [true, 'Table name is required'],
      trim: true,
    },
    table_number: {
      type: Number, // Số thứ tự của bàn
      required: true,
      unique: true, // Đảm bảo mỗi số thứ tự là duy nhất
    },
    slug: {
      type: String,
    },
    qr_code: {
      type: String,
      trim: true,
    },
    qr_image_url: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Trống', 'Đang sử dụng'],
      default: 'Trống',
    },
    current_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware để tạo slug, qrCode và gán table_number
tableSchema.pre('save', async function (next) {
  if (
    this.isModified('name') ||
    this.isModified('restaurant_id') ||
    this.isNew
  ) {
    const restaurant = await mongoose
      .model('Restaurant')
      .findById(this.restaurant_id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    const restaurantSlug = restaurant.slug;

    // Tạo name và slug dựa trên table_number
    if (this.isNew) {
      const maxTable = await Table.findOne({
        restaurant_id: this.restaurant_id,
      }).sort({ table_number: -1 });
      this.table_number = maxTable ? maxTable.table_number + 1 : 1;
    }
    this.name = `Bàn ${this.table_number}`;
    this.slug = slugify(`${this.name}`, { lower: true, strict: true });

    this.qr_code = `http://yourapp.com/${restaurantSlug}/table/${this.slug}`;
  }

  // Sinh qr_image_url nếu chưa có
  if (!this.qr_image_url && this.qr_code) {
    this.qr_image_url = await generateQRCode(this.qr_code);
  }
  next();
});

// Middleware để cập nhật table_number khi xóa
tableSchema.pre('findOneAndDelete', async function (next) {
  const table = await this.model.findOne(this.getQuery());
  if (table) {
    const restaurant_id = table.restaurant_id;
    await Table.updateMany(
      { restaurant_id, table_number: { $gt: table.table_number } },
      { $inc: { table_number: -1 } }
    );
  }
  next();
});

// Đảm bảo table_number unique trong phạm vi restaurant_id
tableSchema.index({ restaurant_id: 1, table_number: 1 }, { unique: true });
tableSchema.index({ restaurant_id: 1, slug: 1 }, { unique: true });

export default mongoose.model('Table', tableSchema);