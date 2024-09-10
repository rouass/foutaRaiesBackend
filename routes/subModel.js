const express = require('express');
const router = express.Router();
const SubModel = require('../models/SubModel');
const Subcategory = require('../models/Subcategory');

router.get('/name/:subcategoryName', async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ name: req.params.subcategoryName });
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    const submodels = await SubModel.find({ parentSubcategoryId: subcategory._id });
    res.json(submodels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub-models', error });
  }
});

router.get('/id/:subcategoryId', async (req, res) => {
  const submodels = await SubModel.find({ parentSubcategoryId: req.params.subcategoryId });

  if (!submodels) {
      return res.status(404).json({ message: 'No submodels found for this subcategory' });
  }

  res.json(submodels);
});
 
module.exports = router;
