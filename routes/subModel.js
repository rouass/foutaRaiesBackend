const express = require('express');
const router = express.Router();
const SubModel = require('../models/SubModel');
const Subcategory = require('../models/Subcategory');



  //submodelFoutadetails
router.get('/id/:subcategoryId', async (req, res) => {
  try {
    // Fetch all submodels for the specified subcategory
    const submodels = await SubModel.find({ parentSubcategoryId: req.params.subcategoryId });

    // If no submodels are found, respond with an error
    if (!submodels) {
      return res.status(404).json({ message: 'No submodels found for this subcategory' });
    }

    // Filter out submodels based on the subcategory exclusion criteria
    // Assuming 'excludeSubcategoryId' is passed as a query parameter
    const excludeSubcategoryId = req.query.excludeSubcategoryId;
    const filteredSubmodels = submodels.filter(submodel => submodel.parentSubcategoryId.toString() !== excludeSubcategoryId);

    res.json(filteredSubmodels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-models', error });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { name, description, image, parentSubcategoryId } = req.body;

    // Check if the parent subcategory exists
    const subcategory = await Subcategory.findById(parentSubcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    const newSubModel = new SubModel({
      name,
      description,
      image,
      parentSubcategoryId
    });

    const savedSubModel = await newSubModel.save();
    res.status(201).json(savedSubModel);
  } catch (error) {
    console.error('Error adding submodel:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
 
module.exports = router;
