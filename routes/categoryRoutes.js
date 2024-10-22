const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory= require('../models/Subcategory');
const mongoose = require('mongoose'); // Add this at the top of the file

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
    const categories = await Category.find({}, '_id name').lean();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found in the database' });
    }

    const subcategories = await Subcategory.find({}, '_id name parentCategoryId').lean();

    if (!subcategories || subcategories.length === 0) {
      console.warn('No subcategories found, returning categories without subcategories.');
    }

    const categoriesWithSubcategories = categories.map((category) => {
      return {
        ...category,
        subcategories: subcategories.filter(
          (sub) => sub.parentCategoryId && sub.parentCategoryId.toString() === category._id.toString()
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
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;