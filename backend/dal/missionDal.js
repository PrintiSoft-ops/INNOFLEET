const { getPool } = require('../config/db');

async function findAllMissions() {
    const pool = await getPool();
    const [rows] = await pool.query(`
        SELECT m.*, v.immat as vehicule_immat, v.marque, v.modele
        FROM missions m
        LEFT JOIN vehicles v ON m.vehicule_id = v.id
        ORDER BY m.debut DESC
    `);
    return rows.map(row => ({
        ...row,
        vehicule: row.vehicule_id ? { _id: row.vehicule_id, immat: row.vehicule_immat, marque: row.marque, modele: row.modele } : null
    }));
}

async function findMissionById(id) {
    const pool = await getPool();
    const [rows] = await pool.query(`
        SELECT m.*, v.immat as vehicule_immat, v.marque, v.modele
        FROM missions m
        LEFT JOIN vehicles v ON m.vehicule_id = v.id
        WHERE m.id = ?
    `, [id]);
    if (!rows[0]) return null;
    const row = rows[0];
    return {
        ...row,
        vehicule: row.vehicule_id ? { _id: row.vehicule_id, immat: row.vehicule_immat, marque: row.marque, modele: row.modele } : null
    };
}

async function createMission(data) {
    const pool = await getPool();
    const [result] = await pool.query(
        `INSERT INTO missions (conducteur, vehicule_id, destination, debut, fin, kmDepart, statut)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.conducteur, data.vehicule, data.destination, data.debut, data.fin || null, data.kmDepart || null, data.statut || 'En cours']
    );
    return { id: result.insertId, ...data };
}

async function updateMission(id, data) {
    const pool = await getPool();
    await pool.query(
        `UPDATE missions SET conducteur = ?, vehicule_id = ?, destination = ?, debut = ?, fin = ?, kmDepart = ?, statut = ?
         WHERE id = ?`,
        [data.conducteur, data.vehicule, data.destination, data.debut, data.fin || null, data.kmDepart || null, data.statut, id]
    );
    return findMissionById(id);
}

async function deleteMission(id) {
    const pool = await getPool();
    await pool.query('DELETE FROM missions WHERE id = ?', [id]);
}

module.exports = {
    findAllMissions,
    findMissionById,
    createMission,
    updateMission,
    deleteMission
};