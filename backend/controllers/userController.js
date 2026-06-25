const bcrypt = require('bcrypt');
const userDal = require('../dal/userDal');

exports.getAll = async (req, res) => {
    try {
        const users = await userDal.findAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { nom, cin, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await userDal.createUser({ nom, cin, password: hashed, role });
        res.status(201).json({ message: 'Utilisateur créé', user: { nom, cin, role } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { nom, cin, role, password } = req.body;
        const update = { nom, cin, role };
        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }
        const user = await userDal.updateUser(req.params.id, update);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await userDal.deleteUser(req.params.id);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};