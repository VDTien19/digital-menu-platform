import mongoose from 'mongoose';
import slugify from 'slugify';
import generateQRCode from '../utils/qrCode.js';

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    name: {
      type: String,
      required: [true, 'Table name is required'],
      trim: true,
    },
    tableNumber: {
      type: Number, // Số thứ tự của bàn
      required: true,
      unique: true, // Đảm bảo mỗi số thứ tự là duy nhất
    },
    slug: {
      type: String,
    },
    qrCode: {
      type: String,
      trim: true,
    },
    qrImageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Trống', 'Đang sử dụng'],
      default: 'Trống',
    },
    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware để tạo slug, qrCode và gán tableNumber
tableSchema.pre('save', async function (next) {
  if (
    this.isModified('name') ||
    this.isModified('restaurantId') ||
    this.isNew
  ) {
    const restaurant = await mongoose
      .model('Restaurant')
      .findById(this.restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    const restaurantSlug = restaurant.slug;

    // Tạo name và slug dựa trên tableNumber
    if (this.isNew) {
      const maxTable = await Table.findOne({
        restaurantId: this.restaurantId,
      }).sort({ tableNumber: -1 });
      this.tableNumber = maxTable ? maxTable.tableNumber + 1 : 1;
    }
    this.name = `Bàn ${this.tableNumber}`;
    this.slug = slugify(`${this.name}`, { lower: true, strict: true });

    this.qrCode = `http://yourapp.com/${restaurantSlug}/table/${this.slug}`;
  }

  // Sinh qrImageUrl nếu chưa có
  if (!this.qrImageUrl && this.qrCode) {
    this.qrImageUrl = await generateQRCode(this.qrCode);
  }
  next();
});

// Middleware để cập nhật tableNumber khi xóa
tableSchema.pre('findOneAndDelete', async function (next) {
  const table = await this.model.findOne(this.getQuery());
  if (table) {
    const restaurantId = table.restaurantId;
    await Table.updateMany(
      { restaurantId, tableNumber: { $gt: table.tableNumber } },
      { $inc: { tableNumber: -1 } }
    );
  }
  next();
});

// Đảm bảo tableNumber unique trong phạm vi restaurantId
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
tableSchema.index({ restaurantId: 1, slug: 1 }, { unique: true });

export default mongoose.model('Table', tableSchema);
