import mongoose from 'mongoose';
import slugify from 'slugify';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    banner_url: {
      type: String,
      trim: true,
      default: null,
    },
    introduction: {
      type: String,
      trim: true,
      default: null,
    },
    thumbnail: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

// Tạo slug trước khi lưu
restaurantSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Restaurant', restaurantSchema);