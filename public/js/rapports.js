import { apiCall, requireAdmin } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    requireAdmin();
    loadRapports();
});

async function loadRapports() {
    try {
        const stats = await apiCall('/stats');
        const ctx1 = document.getElementById('rapport-carburant')?.getContext('2d');
        if (ctx1) {
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: stats.coutCarburant.map(m => m.mois),
                    datasets: [{
                        label: 'Litres consommés',
                        data: stats.coutCarburant.map(m => m.total / 15),
                        borderColor: '#1E6F9F',
                        fill: false
                    }]
                }
            });
        }

        const ctx2 = document.getElementById('rapport-utilisation')?.getContext('2d');
        if (ctx2) {
            const missions = await apiCall('/missions');
            const counts = {};
            missions.forEach(m => {
                const veh = m.vehicule?.immat || 'Inconnu';
                counts[veh] = (counts[veh] || 0) + 1;
            });
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        label: 'Nombre de missions',
                        data: Object.values(counts),
                        backgroundColor: '#F4A261'
                    }]
                }
            });
        }

        const ctx3 = document.getElementById('rapport-maintenance')?.getContext('2d');
        if (ctx3) {
            const maintenances = await apiCall('/maintenances');
            const counts = {};
            maintenances.forEach(m => {
                const veh = m.vehicule?.immat || 'Inconnu';
                counts[veh] = (counts[veh] || 0) + 1;
            });
            new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        label: 'Nombre de maintenances',
                        data: Object.values(counts),
                        backgroundColor: '#08e23f'
                    }]
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
}