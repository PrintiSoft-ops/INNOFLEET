// seed.js - Peupler la base MySQL avec des données fictives
// Exécuter : node seed.js (depuis le dossier backend)

const bcrypt = require('bcrypt');
const { getPool } = require('./config/db');
require('dotenv').config();

// Fonctions utilitaires
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Données de base
const marques = ['FIAT', 'Ford', 'Renault', 'Peugeot', 'Citroën', 'Toyota', 'Volkswagen'];
const modeles = ['500', 'Focus', 'Clio', '208', 'C3', 'Corolla', 'Golf'];
const statutsVehicule = ['disponible', 'en mission', 'maintenance'];
const nomsConducteurs = ['Ahmed Arabi', 'Mohamed Alaoui', 'Fatima Zahra', 'Youssef Benali', 'Khadija Tazi'];
const destinations = ['Rabat', 'Casablanca', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Oujda'];
const composants = ['Moteur', 'Freins', 'Pneumatiques', 'Batterie', 'Embrayage', 'Suspension', 'Direction'];
const typesMaintenance = ['Préventive', 'Curative', 'Inspection'];
const statutsMaintenance = ['Planifiée', 'En cours', 'Terminée'];

async function seedAll() {
    const pool = await getPool();
    console.log('✅ Connexion MySQL établie.');

    try {
        // 1. Désactiver les contraintes de clé étrangère
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');

        // 2. Vider les tables (ordre quelconque car contraintes désactivées)
        await pool.query('DELETE FROM maintenances');
        await pool.query('DELETE FROM fuel');
        await pool.query('DELETE FROM missions');
        await pool.query('DELETE FROM vehicles');
        await pool.query('DELETE FROM users');

        // 3. Réactiver les contraintes
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        // 4. Utilisateurs
        const hashedAdmin = await bcrypt.hash('admin', 10);
        const hashedUser1 = await bcrypt.hash('user1', 10);
        const hashedUser2 = await bcrypt.hash('user2', 10);

        const users = [
            ['Administrateur', 'ADMIN001', '', 'admin'],  // admin sans mot de passe
            ['Ahmed Benani', 'AB12345', hashedUser1, 'user'],
            ['Sara El Amrani', 'SE67890', hashedUser2, 'user']
        ];
        await pool.query(
            'INSERT INTO users (nom, cin, password, role) VALUES ?',
            [users]
        );
        console.log(`✅ ${users.length} utilisateurs créés.`);

        // 5. Véhicules
        const vehiclesData = [];
        for (let i = 0; i < 8; i++) {
            vehiclesData.push([
                `${randomInt(1000, 9999)}${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(10, 99)}`,
                randomElement(marques),
                randomElement(modeles),
                randomElement(statutsVehicule)
            ]);
        }
        const [vehiclesResult] = await pool.query(
            'INSERT INTO vehicles (immat, marque, modele, statut) VALUES ?',
            [vehiclesData]
        );
        // Récupérer les IDs des véhicules insérés
        const [allVehicles] = await pool.query('SELECT id FROM vehicles ORDER BY id');
        const vehIds = allVehicles.map(row => row.id);
        console.log(`✅ ${vehIds.length} véhicules créés.`);

        // 6. Missions
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const missionsData = [];
        for (let i = 0; i < 15; i++) {
            const debut = randomDate(oneMonthAgo, oneMonthLater);
            const fin = Math.random() > 0.3 ? new Date(debut.getTime() + randomInt(1, 5) * 24 * 60 * 60 * 1000) : null;
            missionsData.push([
                randomElement(nomsConducteurs),
                randomElement(vehIds),
                randomElement(destinations),
                debut.toISOString().slice(0, 19).replace('T', ' '),
                fin ? fin.toISOString().slice(0, 19).replace('T', ' ') : null,
                randomInt(5000, 200000),
                fin ? randomInt(5100, 200500) : null,
                fin ? 'Terminée' : 'En cours'
            ]);
        }
        await pool.query(
            `INSERT INTO missions (conducteur, vehicule_id, destination, debut, fin, kmDepart, kmRetour, statut)
             VALUES ?`,
            [missionsData]
        );
        console.log(`✅ ${missionsData.length} missions créées.`);

        // 7. Carburant
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const fuelData = [];
        for (let i = 0; i < 30; i++) {
            const date = randomDate(sixMonthsAgo, now);
            fuelData.push([
                randomElement(vehIds),
                date.toISOString().slice(0, 10),
                randomInt(20, 60),
                randomInt(300, 900)
            ]);
        }
        await pool.query(
            'INSERT INTO fuel (vehicule_id, date, litres, montant) VALUES ?',
            [fuelData]
        );
        console.log(`✅ ${fuelData.length} relevés de carburant créés.`);

        // 8. Maintenances
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        const maintData = [];
        for (let i = 0; i < 10; i++) {
            const dateDebut = randomDate(oneYearAgo, now);
            const dateFin = Math.random() > 0.5 ? randomDate(dateDebut, oneYearLater) : null;
            maintData.push([
                `OR-${2025 + randomInt(0,2)}-${String(i+1).padStart(3,'0')}`,
                randomElement(vehIds),
                randomElement(typesMaintenance),
                randomElement(composants),
                randomInt(100, 2000),
                randomInt(200, 3000),
                dateDebut.toISOString().slice(0, 10),
                dateFin ? dateFin.toISOString().slice(0, 10) : null,
                randomElement(statutsMaintenance)
            ]);
        }
        await pool.query(
            `INSERT INTO maintenances (ordreReparation, vehicule_id, type, composant, coutPiece, coutMainOeuvre, dateDebut, dateFin, statut)
             VALUES ?`,
            [maintData]
        );
        console.log(`✅ ${maintData.length} maintenances créées.`);

        console.log('\n🎉 Toutes les données fictives ont été insérées avec succès !');
    } catch (err) {
        console.error('❌ Erreur lors du seeding :', err);
    } finally {
        // S'assurer que les contraintes sont réactivées même en cas d'erreur
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        await pool.end();
    }
}

seedAll();