const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    cin: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    statut: { type: String, enum: ['Connecté', 'Déconnecté'], default: 'Déconnecté' },
    lastLogin: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);