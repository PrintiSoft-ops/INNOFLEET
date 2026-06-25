const { getPool } = require('../config/db');

async function findAllUsers() {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, nom, cin, role, statut, lastLogin FROM users');
    return rows;
}

async function findUserById(id) {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT id, nom, cin, role, statut, lastLogin FROM users WHERE id = ?', [id]);
    return rows[0];
}

async function findUserByCinOrName(username) {
    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE cin = ? OR nom = ?', [username, username]);
    return rows[0];
}

async function createUser({ nom, cin, password, role }) {
    const pool = await getPool();
    const [result] = await pool.query(
        'INSERT INTO users (nom, cin, password, role) VALUES (?, ?, ?, ?)',
        [nom, cin, password, role]
    );
    return { id: result.insertId, nom, cin, role };
}

async function updateUser(id, { nom, cin, role, password }) {
    const pool = await getPool();
    let query = 'UPDATE users SET nom = ?, cin = ?, role = ?';
    const params = [nom, cin, role];
    if (password) {
        query += ', password = ?';
        params.push(password);
    }
    query += ' WHERE id = ?';
    params.push(id);
    await pool.query(query, params);
    return findUserById(id);
}

async function deleteUser(id) {
    const pool = await getPool();
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
}

async function updateUserStatus(id, statut, lastLogin = null) {
    const pool = await getPool();
    await pool.query(
        'UPDATE users SET statut = ?, lastLogin = ? WHERE id = ?',
        [statut, lastLogin, id]
    );
}

module.exports = {
    findAllUsers,
    findUserById,
    findUserByCinOrName,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus
};