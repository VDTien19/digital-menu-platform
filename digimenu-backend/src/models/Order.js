import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
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
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: [true, 'Menu item is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price must be a positive number'],
        },
      },
    ],
    status: {
      type: String,
      enum: [
        'Chờ xác nhận',
        'Đã nhận đơn',
        'Đang chế biến',
        'Đang lên món',
        'Đã thanh toán',
      ],
      default: 'Chờ xác nhận',
    },
    total_cost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost must be a positive number'],
    },
    payment_method: {
      type: String,
      enum: ['QR', 'Tiền mặt', null],
      default: null,
    },
    payment_confirmed: {
      type: Boolean,
      default: false,
    },
    phone_number: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

// Index cho truy vấn nhanh
orderSchema.index({ restaurant_id: 1 });

export default mongoose.model('Order', orderSchema);