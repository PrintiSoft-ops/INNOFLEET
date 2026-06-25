const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    ordreReparation: { type: String, required: true, unique: true },
    vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: { type: String, enum: ['Préventive', 'Curative', 'Inspection'], default: 'Préventive' },
    composant: { type: String, required: true },
    coutPiece: { type: Number, default: 0 },
    coutMainOeuvre: { type: Number, default: 0 },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date },
    statut: { type: String, enum: ['Planifiée', 'En cours', 'Terminée'], default: 'Planifiée' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);