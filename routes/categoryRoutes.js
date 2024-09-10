const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory= require('../models/Subcategory');

router.get('/', async(req ,res) => {
        try {
          const categories = await Category.find({});
          res.status(200).json(categories);
        } catch (error) {
          res.status(500).json({ message: 'Error retrieving categories', error });
        }
      });


//  fetch categories with their subcategories
router.get('/categwithSub', async (req, res) => {

  try {
    const categories = await Category.find().lean();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found in the database' });
    }

    const subcategories = await Subcategory.find().lean();
    if (!subcategories || subcategories.length === 0) {
      console.warn('No subcategories found, returning categories without subcategories.');
    }

    const categoriesWithSubcategories = categories.map((category) => {
      return {
        ...category,
        subcategories: subcategories.filter(
          (sub) => sub.parentCategoryId.toString() === category._id.toString()
        ),
      };
    });

    res.status(200).json(categoriesWithSubcategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});


router.get('/:name', async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// get category by subcategory name
router.get('/category-by-subcategory/:subcategoryName', async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ name: req.params.subcategoryName }).lean();
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });

    const category = await Category.findById(subcategory.parentCategoryId).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
