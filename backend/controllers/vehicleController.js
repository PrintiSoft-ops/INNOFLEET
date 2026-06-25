const vehicleDal = require('../dal/vehicleDal');

exports.getAll = async (req, res) => {
    try {
        const vehicles = await vehicleDal.findAllVehicles();
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const vehicle = await vehicleDal.findVehicleById(req.params.id);
        if (!vehicle) return res.status(404).json({ error: 'Véhicule non trouvé' });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const vehicle = await vehicleDal.createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const vehicle = await vehicleDal.updateVehicle(req.params.id, req.body);
        res.json(vehicle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        await vehicleDal.deleteVehicle(vehicleId);
        res.json({ message: 'Véhicule supprimé avec succès.' });
    } catch (err) {
        // Afficher l'erreur dans la console pour déboguer
        console.error('Erreur lors de la suppression :', err);

        // Détection des erreurs de clé étrangère
        if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED' || err.errno === 1451) {
            return res.status(409).json({
                error: '❌ Impossible de supprimer ce véhicule car il est utilisé dans des missions, des maintenances ou des relevés de carburant. Veuillez d’abord supprimer ou réaffecter ces enregistrements.'
            });
        }

        // Si une autre erreur, on la renvoie pour le débogage
        res.status(500).json({ error: err.message });
    }
};