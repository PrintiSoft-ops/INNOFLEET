const mysql = require('mysql2/promise');

let pool = null;

async function getPool() {
    if (!pool) {
        // Construction de la configuration SSL
        const sslConfig = {};
        if (process.env.DB_CA_CERT) {
            // Si le certificat CA est fourni en variable d'environnement (Recommandé pour Render)
            sslConfig.ssl = { ca: process.env.DB_CA_CERT };
        } else {
            // Fallback pour le développement local (ou si vous ne voulez pas gérer le certificat)
            sslConfig.ssl = { rejectUnauthorized: false };
        }

        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'innofleet',
            port: process.env.DB_PORT || 12345,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            ...sslConfig // On applique la config SSL ici
        });
    }
    return pool;
}

module.exports = { getPool };