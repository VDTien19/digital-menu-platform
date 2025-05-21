import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table is required'],
    },
    items: [
      {
        itemId: {
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
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost must be a positive number'],
    },
    paymentMethod: {
      type: String,
      enum: ['QR', 'Tiền mặt', null],
      default: null,
    },
    paymentConfirmed: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
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
orderSchema.index({ restaurantId: 1 });

export default mongoose.model('Order', orderSchema);
