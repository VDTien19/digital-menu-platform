import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoice_number: {
    type: String,
    required: true,
    unique: true,
  },
  order_group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderGroup',
    required: true,
  },
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  total_cost: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  payment_date: {
    type: Date,
    required: true,
  },
  restaurant_info: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Invoice', invoiceSchema);