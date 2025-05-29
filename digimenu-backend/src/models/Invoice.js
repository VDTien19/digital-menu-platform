import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
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
    total_cost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost must be a positive number'],
    },
    payment_method: {
      type: String,
      enum: ['QR', 'Tiền mặt'],
      required: [true, 'Payment method is required'],
    },
    phone_number: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    pdf_url: {
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
    is_rated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index cho truy vấn nhanh
invoiceSchema.index({ restaurant_id: 1 });
invoiceSchema.index({ phone_number: 1 });

export default mongoose.model('Invoice', invoiceSchema);