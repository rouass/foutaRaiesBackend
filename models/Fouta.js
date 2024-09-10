const mongoose = require('mongoose');

const foutaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  title: {
    type: String,
  },
  ref: {
    type: String,
  },
  dimensions: [String], // Array of dimensions
  images: [String], // Array of image URLs
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
});

module.exports = mongoose.model('Fouta', foutaSchema);
