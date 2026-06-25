const missionDal = require('../dal/missionDal');

exports.getAll = async (req, res) => {
    try {
        const missions = await missionDal.findAllMissions();
        res.json(missions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const mission = await missionDal.createMission(req.body);
        res.status(201).json(mission);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const mission = await missionDal.updateMission(req.params.id, req.body);
        if (!mission) return res.status(404).json({ error: 'Mission non trouvée' });
        res.json(mission);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await missionDal.deleteMission(req.params.id);
        res.json({ message: 'Mission supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};