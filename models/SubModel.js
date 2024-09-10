// models/SubModel.js
const mongoose = require('mongoose');

const subModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, // URL to sub-model image
  },
  parentSubcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
});

module.exports = mongoose.model('SubModel', subModelSchema);
