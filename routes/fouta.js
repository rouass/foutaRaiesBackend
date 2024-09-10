const express = require('express');
const router = express.Router();
const Fouta = require('../models/Fouta');
const Subcategory = require('../models/Subcategory');
const SubModel = require('../models/SubModel');
const Category = require('../models/Category');

router.get('/name/:subcategoryName', async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ name: req.params.subcategoryName });
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    const foutas = await Fouta.find({ subcategoryId: subcategory._id });
    res.json(foutas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foutas', error });
  }
});

//  get submodels and fouta details by subcategory name
router.get('/submodels-and-fouta/:subcategoryName', async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ name: req.params.subcategoryName });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const fouta = await Fouta.findOne({ subcategoryId: subcategory._id });

    const submodels = await SubModel.find({ parentSubcategoryId: subcategory._id });
    res.json({ fouta, submodels });
  } catch (error) {
    console.error('Error fetching submodels and fouta details:', error);
    res.status(500).json({ message: 'Error fetching submodels and fouta details', error });
  }
});
// similarProducts
router.get('/category/:categoryName', async (req, res) => {
  try {
    const { excludeFoutaId, excludeSubcategoryId, excludeSubmodelId } = req.query;

    // Find the category by its name
    const category = await Category.findOne({ name: req.params.categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find all subcategories belonging to this category
    const subcategories = await Subcategory.find({ parentCategoryId: category._id });

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found for this category' });
    }

    // Extract the subcategory IDs
    const subcategoryIds = subcategories.map(subcategory => subcategory._id);

    // Build the query to find foutas
    const query = { subcategoryId: { $in: subcategoryIds } };

    // Exclude the current Fouta
    if (excludeFoutaId) {
      query._id = { $ne: excludeFoutaId };
    }

    // Exclude Foutas from the same subcategory
    if (excludeSubcategoryId) {
      query.subcategoryId = { $ne: excludeSubcategoryId };
    }

    // Exclude Foutas from the same submodel
    if (excludeSubmodelId) {
      // Fetch submodels belonging to the excluded submodelId
      const submodels = await SubModel.find({ parentSubcategoryId: excludeSubmodelId });
      const submodelIds = submodels.map(submodel => submodel._id);
      query.submodelId = { $nin: submodelIds };
    }

    const foutas = await Fouta.find(query);

    if (!foutas || foutas.length === 0) {
      return res.status(404).json({ message: 'No foutas found for this category' });
    }

    res.json(foutas);
  } catch (error) {
    console.error('Error fetching foutas by category:', error.message);
    res.status(500).json({ message: 'Error fetching foutas by category', error: error.message });
  }
});
router.get('/ids/:ids', async (req, res) => {
  try {
    const ids = req.params.ids.split(','); // Assuming IDs are passed as a comma-separated string
    const foutas = await Fouta.find({ _id: { $in: ids } });
    res.json(foutas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foutas', error });
  }
});

module.exports = router;
