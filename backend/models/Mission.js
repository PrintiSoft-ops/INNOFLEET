const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    conducteur: { type: String, required: true },
    vehicule: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    destination: { type: String }, // <-- AJOUT
    debut: { type: Date, required: true },
    fin: { type: Date },
    kmDepart: { type: Number },
    kmRetour: { type: Number },
    statut: { type: String, enum: ['En cours', 'Terminée'], default: 'En cours' }
}, { timestamps: true });

module.exports = mongoose.model('Mission', missionSchema);