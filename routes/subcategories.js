const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
//categoryDetails
router.get('/category-details/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query params
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const [subcategories, totalSubcategories] = await Promise.all([
      Subcategory.find({ parentCategoryId: category._id })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('name description image') // Fetch only necessary fields
        .lean(),
      Subcategory.countDocuments({ parentCategoryId: category._id })
    ]);

    res.status(200).json({ subcategories, total: totalSubcategories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Route to get subcategory by category name and subcategory name
router.get('/:categoryName/:subcategoryName', async (req, res) => {
  try {
    const { categoryName, subcategoryName } = req.params;

    // Find the category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory by name and parentCategoryId
    const subcategory = await Subcategory.findOne({
      name: subcategoryName,
      parentCategoryId: category._id,
    });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    return res.json(subcategory);
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { name, description, image, parentCategoryId } = req.body;

    const newSubcategory = new Subcategory({
      name,
      description,
      image,
      parentCategoryId
    });

    const savedSubcategory = await newSubcategory.save();
    res.status(201).json(savedSubcategory);
  } catch (error) {
    console.error('Error adding subcategory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
