const maintenanceDal = require('../dal/maintenanceDal');

exports.getAll = async (req, res) => {
    try {
        const items = await maintenanceDal.findAllMaintenances();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const item = await maintenanceDal.createMaintenance(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const item = await maintenanceDal.updateMaintenance(req.params.id, req.body);
        if (!item) return res.status(404).json({ error: 'Non trouvé' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await maintenanceDal.deleteMaintenance(req.params.id);
        res.json({ message: 'Supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};