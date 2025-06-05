import mongoose from 'mongoose';
import validator from 'validator';

const tableSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    name: {
      type: Number,
      required: [true, 'Name is required'],
      validate: {
        validator: Number.isInteger,
        message: 'Name must be an integer',
      },
      min: [1, 'Name must be greater than or equal to 1'],
    },
    status: {
      type: String,
      enum: ['Trống', 'Đang sử dụng'],
      default: 'Trống',
      required: [true, 'Status is required'],
    },
    encode: {
      type: String,
      default: null,
    },
    table_url: {
      type: String,
      required: [true, 'Table URL is required'],
      validate: {
        validator: value => validator.isURL(value),
        message: 'Invalid URL format',
      },
    },
    qr_code: {
      type: String,
      default: null,
    },
    qr_image_url: {
      type: String,
      default: null,
    },
    current_order_group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderGroup',
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware pre('save') để validate dữ liệu
tableSchema.pre('save', async function (next) {
  const restaurant = await mongoose.model('Restaurant').findById(this.restaurant_id);
  if (!restaurant) {
    return next(new Error('Restaurant not found'));
  }
  next();
});

// Middleware pre('findOneAndDelete') để kiểm tra trạng thái trước khi xóa
tableSchema.pre('findOneAndDelete', async function (next) {
  const table = await this.model.findOne(this.getQuery());
  if (table) {
    if (table.status === 'Đang sử dụng') {
      return next(new Error('Cannot delete table that is in use'));
    }
  }
  next();
});

// Đảm bảo name unique trong phạm vi restaurant_id
tableSchema.index({ restaurant_id: 1, name: 1 }, { unique: true });
// Thêm index cho table_url để tăng tốc độ truy vấn nếu dùng để tìm bàn
tableSchema.index({ table_url: 1 });

export default mongoose.model('Table', tableSchema);