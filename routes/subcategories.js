const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

router.get('/category-details/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const subcategories = await Subcategory.find({ parentCategoryId: category._id });

    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().lean();
    for (const category of categories) {
      category.subcategories = await Subcategory.find({ parentCategoryId: category._id }).lean();
    }
    res.json(categories);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
