const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
require('dotenv').config({ path: './backend/.env' });

const app = express();

// Compression Gzip
app.use(compression());

// CORS dynamique avec variable d'environnement
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5000',
  'https://innofleet.vercel.app' // ← à adapter si votre URL Vercel est différente
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Servir les fichiers statiques du frontend (uniquement en local, sur Vercel c'est géré par le build)
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
}

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/missions', require('./routes/missionRoutes'));
app.use('/api/fuel', require('./routes/fuelRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/maintenances', require('./routes/maintenanceRoutes'));

// Health check
app.get('/api/health', (req, res) => res.status(200).send('OK'));

// En local, servir index.html pour les routes non-API
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

// Démarrer le serveur seulement si exécuté directement
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Serveur INNOFLEET démarré sur http://localhost:${PORT}`);
    console.log(`   API disponible sur http://localhost:${PORT}/api`);
  });
}

module.exports = app;