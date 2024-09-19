const express = require('express');
const router = express.Router();
const Devis = require('../models/deviss');
const Fouta = require('../models/Fouta');

router.post('/', async (req, res) => {
    try {
        console.log('Received Devis Data:', req.body);

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

module.exports = router;
