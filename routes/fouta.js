const express = require('express');
const router = express.Router();
const Fouta = require('../models/Fouta');
const Subcategory = require('../models/Subcategory');
const SubModel = require('../models/SubModel');
const Category = require('../models/Category');



// Updated Route to Fetch Submodels and Foutas
//submodelFouta
router.get('/submodels-and-fouta/:categoryName/:subcategoryName', async (req, res) => {
  try {
    const { categoryName, subcategoryName } = req.params;

    // Find the category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the subcategory by name and category
    const subcategory = await Subcategory.findOne({
      name: subcategoryName,
      parentCategoryId: category._id,
    });

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // Fetch foutas and submodels
    const foutas = await Fouta.find({ subcategoryId: subcategory._id });
    const submodels = await SubModel.find({ parentSubcategoryId: subcategory._id });

    res.json({ foutas, submodels });
  } catch (error) {
    console.error('Error fetching submodels and fouta details:', error);
    res.status(500).json({ message: 'Error fetching submodels and fouta details', error });
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


// Suggest similar subcategories by category name
  //submodelFoutaDetails

router.get('/category/:categoryName', async (req, res) => {
  try {
    const { excludeFoutaId } = req.query;
 
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

    // Filter out the subcategories based on exclusion criteria
    let filteredSubcategories = subcategories;

    // Exclude subcategories that contain the excluded Fouta
    if (excludeFoutaId) {
      const fouta = await Fouta.findById(excludeFoutaId);
      if (fouta && fouta.subcategoryId) {
        filteredSubcategories = filteredSubcategories.filter(subcategory => subcategory._id.toString() !== fouta.subcategoryId.toString());
      }
    }

    res.json(filteredSubcategories);
  } catch (error) {
    console.error('Error fetching subcategories by category:', error.message);
    res.status(500).json({ message: 'Error fetching subcategories by category', error: error.message });
  }
});

//devisForm
router.get('/ids/:ids', async (req, res) => {
  try {
    const ids = req.params.ids.split(','); // Assuming IDs are passed as a comma-separated string
    const foutas = await Fouta.find({ _id: { $in: ids } });
    res.json(foutas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foutas', error });
  }
});


router.post('/add', async (req, res) => {
  try {
    const { name, description, title, ref, dimensions, images, subcategoryId } = req.body;

    // Ensure dimensions and images are arrays
    const formattedDimensions = Array.isArray(dimensions) ? dimensions : dimensions.split(',').map(d => d.trim());
    const formattedImages = Array.isArray(images) ? images : images.split(',').map(i => i.trim());

    const newFouta = new Fouta({
      name,
      description,
      title,
      ref,
      dimensions: formattedDimensions,
      images: formattedImages,
      subcategoryId
    });

    const savedFouta = await newFouta.save();
    res.status(201).json(savedFouta);
  } catch (error) {
    console.error('Error adding fouta:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
