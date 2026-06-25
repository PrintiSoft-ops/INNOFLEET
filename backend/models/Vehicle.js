const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    immat: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    statut: { type: String, enum: ['disponible', 'en mission', 'maintenance'], default: 'disponible' }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);