const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
const connectDB = require('../backend/config/db');
connectDB();

// Servir le frontend statique (important : avant les routes API pour ne pas les bloquer)
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes API
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/users', require('../backend/routes/userRoutes'));
app.use('/api/vehicles', require('../backend/routes/vehicleRoutes'));
app.use('/api/missions', require('../backend/routes/missionRoutes'));
app.use('/api/fuel', require('../backend/routes/fuelRoutes'));
app.use('/api/stats', require('../backend/routes/statsRoutes'));
app.use('/api/maintenances', require('../backend/routes/maintenanceRoutes'));

// Pour toutes les autres routes (ex: /, /vehicules.html, etc.), renvoyer index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;