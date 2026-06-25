const { getPool } = require('../config/db');

async function findAllMaintenances() {
    const pool = await getPool();
    const [rows] = await pool.query(`
        SELECT m.*, v.immat as vehicule_immat, v.marque, v.modele
        FROM maintenances m
        LEFT JOIN vehicles v ON m.vehicule_id = v.id
        ORDER BY m.dateDebut DESC
    `);
    return rows.map(row => ({
        ...row,
        vehicule: row.vehicule_id ? { _id: row.vehicule_id, immat: row.vehicule_immat, marque: row.marque, modele: row.modele } : null
    }));
}

async function countByStatus(statuses) {
    const pool = await getPool();
    const placeholders = statuses.map(() => '?').join(',');
    const [rows] = await pool.query(
        `SELECT COUNT(*) as count FROM maintenances WHERE statut IN (${placeholders})`,
        statuses
    );
    return rows[0].count;
}

async function createMaintenance(data) {
    const pool = await getPool();
    const [result] = await pool.query(
        `INSERT INTO maintenances (ordreReparation, vehicule_id, type, composant, coutPiece, coutMainOeuvre, dateDebut, dateFin, statut)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.ordreReparation, data.vehicule, data.type, data.composant, data.coutPiece, data.coutMainOeuvre, data.dateDebut, data.dateFin || null, data.statut]
    );
    return { id: result.insertId, ...data };
}

async function updateMaintenance(id, data) {
    const pool = await getPool();
    await pool.query(
        `UPDATE maintenances SET ordreReparation = ?, vehicule_id = ?, type = ?, composant = ?, coutPiece = ?, coutMainOeuvre = ?, dateDebut = ?, dateFin = ?, statut = ?
         WHERE id = ?`,
        [data.ordreReparation, data.vehicule, data.type, data.composant, data.coutPiece, data.coutMainOeuvre, data.dateDebut, data.dateFin || null, data.statut, id]
    );
    const [rows] = await pool.query('SELECT * FROM maintenances WHERE id = ?', [id]);
    return rows[0];
}

async function deleteMaintenance(id) {
    const pool = await getPool();
    await pool.query('DELETE FROM maintenances WHERE id = ?', [id]);
}

module.exports = {
    findAllMaintenances,
    countByStatus,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
};