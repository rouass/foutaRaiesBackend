const express = require('express');
const router = express.Router();
const Devis = require('../models/deviss');
const Fouta = require('../models/Fouta');
const checkAuth = require('../middleware/check-user');

router.post('/', async (req, res) => {
    try {

        const selectedFoutas = await Promise.all(req.body.selectedFoutas.map(async (item) => {
            const fouta = await Fouta.findById(item.fouta);
            if (!fouta) throw new Error(`Fouta with ID ${item.fouta} not found`);
            return {
                fouta: item.fouta,
                name: fouta.name,
                dimension: item.dimension,  // Include the dimension here
                quantity: item.quantity,
                comments: item.comments
            };
        }));

        const devis = new Devis({
            name: req.body.name,
            prenom: req.body.prenom,
            numtel: req.body.numtel,
            email: req.body.email,
            comments: req.body.comments,
            selectedFoutas: selectedFoutas,
        });

        await devis.save();

        res.status(201).json(devis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/list-devis', checkAuth, async (req, res) => {
  if (req.userData.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Only admins can view this." });
  }

  try {
      const devis = await Devis.find().populate('selectedFoutas.fouta'); // Populate fouta details
      res.status(200).json({ message: 'Devis fetched successfully', devis });
  } catch (error) {
      res.status(500).json({
          message: "Fetching devis failed!",
          error: error.message
      });
  }
});


const PDFDocument = require('pdfkit');

router.get('/download-pdf/:id', checkAuth, async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Only admins can view this." });
  }

  try {
    const devis = await Devis.findById(req.params.id).populate('selectedFoutas.fouta');
    if (!devis) {
      return res.status(404).json({ message: 'Devis not found' });
    }

    const doc = new PDFDocument();
    let filename = `Devis-${devis._id}.pdf`;
    filename = encodeURIComponent(filename);
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Devis Details', { align: 'center' });
    doc.text(`Name: ${devis.name} ${devis.prenom}`);
    doc.text(`Email: ${devis.email}`);
    doc.text(`Phone: ${devis.numtel}`);
    doc.text(`Comments: ${devis.comments}`);

    doc.text('Selected Foutas:', { align: 'left', underline: true });
    devis.selectedFoutas.forEach(fouta => {
      doc.text(`Fouta: ${fouta.fouta.name} (Quantity: ${fouta.quantity})`);
      doc.text(`Dimension: ${fouta.dimension}`);
      if (fouta.comments) {
        doc.text(`Comments: ${fouta.comments}`);
      }
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "PDF generation failed", error: error.message });
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  if (req.userData.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Only admins can delete devis." });
  }

  try {
    const devisId = req.params.id;
    const deletedDevis = await Devis.findByIdAndDelete(devisId);

    if (!deletedDevis) {
      return res.status(404).json({ message: "Devis not found!" });
    }

    res.status(200).json({ message: "Devis deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Deleting devis failed!", error: error.message });
  }
});


  
module.exports = router;
