import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
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
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost must be a positive number'],
    },
    paymentMethod: {
      type: String,
      enum: ['QR', 'Tiền mặt'],
      required: [true, 'Payment method is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
      default: null,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: null,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index cho truy vấn nhanh
invoiceSchema.index({ restaurantId: 1 });
invoiceSchema.index({ phoneNumber: 1 });

export default mongoose.model('Invoice', invoiceSchema);
