import mongoose from 'mongoose';

const orderGroupSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    table_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table is required'],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        default: [],
      },
    ],
    payment_status: {
      type: String,
      enum: ['Chưa thanh toán', 'Đã thanh toán'],
      default: 'Chưa thanh toán',
    },
    total_cost: {
      type: Number,
      default: 0,
      min: [0, 'Total cost must be a positive number'],
    },
    payment_method: {
      type: String,
      enum: ['QR', 'Tiền mặt', null],
      default: null,
    },
    payment_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index cho truy vấn nhanh
orderGroupSchema.index({ restaurant_id: 1 });
orderGroupSchema.index({ table_id: 1 });

export default mongoose.model('OrderGroup', orderGroupSchema);