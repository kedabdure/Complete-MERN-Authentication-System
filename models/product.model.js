const mongoose = require('mongoose');

const productShema = mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productShema);
