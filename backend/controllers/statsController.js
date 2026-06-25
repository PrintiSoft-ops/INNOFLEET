const NodeCache = require('node-cache');
const vehicleDal = require('../dal/vehicleDal');
const missionDal = require('../dal/missionDal');
const fuelDal = require('../dal/fuelDal');
const maintenanceDal = require('../dal/maintenanceDal');

const statsCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

exports.getStats = async (req, res) => {
    try {
        const cached = statsCache.get('globalStats');
        if (cached) return res.json(cached);

        const vehicles = await vehicleDal.findAllVehicles();
        const missions = await missionDal.findAllMissions();
        const fuels = await fuelDal.findAllFuels();

        const dispo = vehicles.filter(v => v.statut === 'disponible').length;
        const enMission = vehicles.filter(v => v.statut === 'en mission').length;
        const maintenance = vehicles.filter(v => v.statut === 'maintenance').length;

        const missionsEnCours = missions.filter(m => m.statut === 'En cours').length;
        const maintenancesEnCours = await maintenanceDal.countByStatus(['Planifiée', 'En cours']);

        const now = new Date();
        const sixMois = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const moisAvecAnnee = `${d.toLocaleString('fr', { month: 'short' })} ${d.getFullYear()}`;
            sixMois.push({ mois: moisAvecAnnee, total: 0 });
        }

        fuels.forEach(f => {
            const date = new Date(f.date);
            for (let idx = 0; idx < sixMois.length; idx++) {
                const [moisTexte, annee] = sixMois[idx].mois.split(' ');
                const moisIndex = new Date(Date.parse(`${moisTexte} 1, ${annee}`)).getMonth();
                const anneeNum = parseInt(annee);
                if (date.getMonth() === moisIndex && date.getFullYear() === anneeNum) {
                    sixMois[idx].total += f.montant;
                    break;
                }
            }
        });

        const stats = {
            vehicules: { dispo, enMission, maintenance },
            missionsEnCours,
            maintenancesEnCours,
            coutCarburant: sixMois
        };

        statsCache.set('globalStats', stats);
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};