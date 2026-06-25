import { apiCall, initSearch } from './script.js';

let missions = [];
let vehicles = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadVehicles();
    await loadMissions();
    initModal();
});

async function loadVehicles() {
    try {
        vehicles = await apiCall('/vehicles');
        const select = document.getElementById('mission-vehicule');
        const editSelect = document.getElementById('edit-mission-vehicule');
        const options = vehicles.map(v => `<option value="${v.id}">${v.immat} (${v.marque} ${v.modele})</option>`).join('');
        select.innerHTML = options;
        editSelect.innerHTML = options;
    } catch (err) {
        console.error(err);
    }
}

async function loadMissions() {
    try {
        missions = await apiCall('/missions');
        renderTable();
    } catch (err) {
        console.error(err);
    }
}

function renderTable() {
    const tbody = document.querySelector('#missions-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    missions.forEach(m => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${m.conducteur}</td>
            <td>${m.vehicule?.immat || 'Inconnu'}</td>
            <td>${new Date(m.debut).toLocaleDateString('fr')}</td>
            <td>${m.fin ? new Date(m.fin).toLocaleDateString('fr') : '—'}</td>
            <td><span class="${m.statut === 'Terminée' ? 'status-connected' : 'status-warning'}">${m.statut}</span></td>
            <td class="action-icons">
                <i class="fas fa-edit" onclick="editMission('${m.id}')"></i>
                <i class="fas fa-trash" onclick="deleteMission('${m.id}')"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
    initSearch('#missions-table', '#searchMission', [0, 1, 4]);
}

function saveMission() {
    const data = {
        conducteur: document.getElementById('mission-conducteur').value,
        vehicule: document.getElementById('mission-vehicule').value,
        debut: document.getElementById('mission-debut').value,
        fin: document.getElementById('mission-fin').value || null,
        kmDepart: parseFloat(document.getElementById('mission-km').value) || null,
        destination: document.getElementById('mission-destination').value
    };
    if (!data.conducteur || !data.vehicule || !data.debut) {
        alert('Conducteur, véhicule et date de début sont requis');
        return;
    }
    apiCall('/missions', { method: 'POST', body: JSON.stringify(data) })
        .then(() => {
            loadMissions();
            document.getElementById('mission-conducteur').value = '';
            document.getElementById('mission-destination').value = '';
            document.getElementById('mission-debut').value = '';
            document.getElementById('mission-fin').value = '';
            document.getElementById('mission-km').value = '';
        })
        .catch(err => alert(err.message));
}

function editMission(id) {
    const m = missions.find(m => m.id === id);
    if (!m) return;
    editingId = id;
    document.getElementById('edit-mission-conducteur').value = m.conducteur;
    document.getElementById('edit-mission-vehicule').value = m.vehicule?._id || m.vehicule;
    document.getElementById('edit-mission-destination').value = m.destination || '';
    document.getElementById('edit-mission-debut').value = m.debut.split('T')[0];
    document.getElementById('edit-mission-fin').value = m.fin ? m.fin.split('T')[0] : '';
    document.getElementById('edit-mission-km').value = m.kmDepart || '';
    document.getElementById('edit-mission-statut').value = m.statut;
    document.getElementById('modal-mission').style.display = 'block';
}

function updateMission() {
    const data = {
        conducteur: document.getElementById('edit-mission-conducteur').value,
        vehicule: document.getElementById('edit-mission-vehicule').value,
        destination: document.getElementById('edit-mission-destination').value,
        debut: document.getElementById('edit-mission-debut').value,
        fin: document.getElementById('edit-mission-fin').value || null,
        kmDepart: parseFloat(document.getElementById('edit-mission-km').value) || null,
        statut: document.getElementById('edit-mission-statut').value
    };
    apiCall(`/missions/${editingId}`, { method: 'PUT', body: JSON.stringify(data) })
        .then(() => {
            closeModal();
            loadMissions();
        })
        .catch(err => alert(err.message));
}

function deleteMission(id) {
    if (!confirm('Supprimer cette mission ?')) return;
    apiCall(`/missions/${id}`, { method: 'DELETE' })
        .then(() => loadMissions())
        .catch(err => alert(err.message));
}

function initModal() {
    const modal = document.getElementById('modal-mission');
    const span = modal.querySelector('.close');
    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal-mission').style.display = 'none';
}

window.saveMission = saveMission;
window.editMission = editMission;
window.deleteMission = deleteMission;
window.updateMission = updateMission;