const fuelDal = require('../dal/fuelDal');

exports.getAll = async (req, res) => {
    try {
        const fuels = await fuelDal.findAllFuels();
        res.json(fuels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const fuel = await fuelDal.createFuel(req.body);
        res.status(201).json(fuel);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const fuel = await fuelDal.updateFuel(req.params.id, req.body);
        if (!fuel) return res.status(404).json({ error: 'Entrée non trouvée' });
        res.json(fuel);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await fuelDal.deleteFuel(req.params.id);
        res.json({ message: 'Entrée supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};