const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDal = require('../dal/userDal');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userDal.findUserByCinOrName(username);
        if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

        // Permettre à l'admin de se connecter sans mot de passe (si le champ password est vide)
        let valid = false;
        if ((user.nom === 'admin' || user.nom === 'Administrateur') && user.password === '' && password === '') {
            valid = true;
        } else {
            valid = await bcrypt.compare(password, user.password);
        }

        if (!valid) return res.status(401).json({ error: 'Identifiants incorrects' });

        await userDal.updateUserStatus(user.id, 'Connecté', new Date());

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.nom },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { nom: user.nom, role: user.role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        if (req.user && req.user.id) {
            await userDal.updateUserStatus(req.user.id, 'Déconnecté');
        }
        res.json({ message: 'Déconnecté' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};