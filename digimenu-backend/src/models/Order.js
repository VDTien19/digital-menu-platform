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
    order_group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderGroup',
      required: [true, 'Order group is required'],
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
          min: [0, 'Price must be a positive number'],
          // Bỏ required vì giá sẽ được lấy từ MenuItem
        },
      },
    ],
    total_cost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost must be a positive number'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Đang chờ', 'Đã nhận'],
      default: 'Đang chờ',
    },
  },
  { timestamps: true }
);

// Index cho truy vấn nhanh
orderSchema.index({ restaurant_id: 1 });
orderSchema.index({ table_id: 1 });
orderSchema.index({ order_group_id: 1 });

export default mongoose.model('Order', orderSchema);