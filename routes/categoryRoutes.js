const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory= require('../models/Subcategory');

//foutadetails
router.get('/', async(req ,res) => {
        try {
          const categories = await Category.find({});
          res.status(200).json(categories);
        } catch (error) {
          res.status(500).json({ message: 'Error retrieving categories', error });
        }
      });


//  fetch categories with their subcategories
//navbar
router.get('/categwithSub', async (req, res) => {
  try {
    // Fetch categories with only the _id and name fields
    const categories = await Category.find({}, '_id name').lean();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found in the database' });
    }

    // Fetch subcategories with only the _id, name, and parentCategoryId fields
    const subcategories = await Subcategory.find({}, '_id name parentCategoryId').lean();

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

//category-details
router.get('/:name', async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.name });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//submodelFoutaDetails
router.get('/category-by-id/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category', error });
  }
});


module.exports = router;
