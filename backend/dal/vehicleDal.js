const { getPool } = require('../config/db');

async function findAllVehicles() {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, immat, marque, modele, statut FROM vehicles');
    return rows;
}

async function findVehicleById(id) {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    return rows[0];
}

async function createVehicle({ immat, marque, modele, statut }) {
    const pool = await getPool();
    const [result] = await pool.query(
        'INSERT INTO vehicles (immat, marque, modele, statut) VALUES (?, ?, ?, ?)',
        [immat, marque, modele, statut]
    );
    return { id: result.insertId, immat, marque, modele, statut };
}

async function updateVehicle(id, { immat, marque, modele, statut }) {
    const pool = await getPool();
    await pool.query(
        'UPDATE vehicles SET immat = ?, marque = ?, modele = ?, statut = ? WHERE id = ?',
        [immat, marque, modele, statut, id]
    );
    return findVehicleById(id);
}

async function deleteVehicle(id) {
    const pool = await getPool();
    await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
}

module.exports = {
    findAllVehicles,
    findVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};