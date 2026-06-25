const { getPool } = require('../config/db');

async function findAllFuels() {
    const pool = await getPool();
    const [rows] = await pool.query(`
        SELECT f.*, v.immat as vehicule_immat
        FROM fuel f
        LEFT JOIN vehicles v ON f.vehicule_id = v.id
        ORDER BY f.date DESC
    `);
    return rows.map(row => ({
        ...row,
        vehicule: row.vehicule_id ? { _id: row.vehicule_id, immat: row.vehicule_immat } : null
    }));
}

async function createFuel(data) {
    const pool = await getPool();
    const [result] = await pool.query(
        'INSERT INTO fuel (vehicule_id, date, litres, montant) VALUES (?, ?, ?, ?)',
        [data.vehicule, data.date, data.litres, data.montant]
    );
    return { id: result.insertId, ...data };
}

async function updateFuel(id, data) {
    const pool = await getPool();
    await pool.query(
        'UPDATE fuel SET vehicule_id = ?, date = ?, litres = ?, montant = ? WHERE id = ?',
        [data.vehicule, data.date, data.litres, data.montant, id]
    );
    const [rows] = await pool.query('SELECT * FROM fuel WHERE id = ?', [id]);
    return rows[0];
}

async function deleteFuel(id) {
    const pool = await getPool();
    await pool.query('DELETE FROM fuel WHERE id = ?', [id]);
}

module.exports = {
    findAllFuels,
    createFuel,
    updateFuel,
    deleteFuel
};