const mongoose = require('mongoose');
const selectedFoutaSchema = new mongoose.Schema({
    fouta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fouta',
        required: true,
    },
    dimension: {  
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    comments: {
        type: String,
    }
});
const devisSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    numtel: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
    },
    selectedFoutas: [selectedFoutaSchema],
});

const Devis = mongoose.model('Devis', devisSchema);

module.exports = Devis;
