const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
    vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    date: { type: Date, required: true },
    litres: { type: Number, required: true },
    montant: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fuel', fuelSchema);