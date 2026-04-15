const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  sellingPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: false },
  sizes: [{
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    mrp: { type: Number },
    price: { type: Number }
  }],
  stock: { type: Number, required: true, default: 0 }, // Total stock across all sizes
  images: [{ type: String }], // Array of image URLs
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  shippingCharges: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
