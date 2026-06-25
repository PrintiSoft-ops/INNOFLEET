import { apiCall, initSearch } from './script.js';

let maintenances = [];
let vehicles = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadVehicles();
    await loadMaintenances();
    initModal();
});

async function loadVehicles() {
    try {
        vehicles = await apiCall('/vehicles');
        const select = document.getElementById('maint-vehicule');
        const editSelect = document.getElementById('edit-maint-vehicule');
        const options = vehicles.map(v => `<option value="${v.id}">${v.immat} (${v.marque} ${v.modele})</option>`).join('');
        select.innerHTML = options;
        editSelect.innerHTML = options;
    } catch (err) {
        console.error(err);
    }
}

async function loadMaintenances() {
    try {
        maintenances = await apiCall('/maintenances');
        renderTable();
    } catch (err) {
        console.error(err);
        maintenances = [];
        renderTable();
    }
}

function renderTable() {
    const tbody = document.querySelector('#maintenance-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    maintenances.forEach(m => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${m.ordreReparation || '—'}</td>
            <td>${m.vehicule?.immat || 'Inconnu'}</td>
            <td>${m.type || '—'}</td>
            <td>${m.composant}</td>
            <td>${m.coutPiece || 0} FCFA</td>
            <td>${m.coutMainOeuvre || 0} FCFA</td>
            <td>${m.dateDebut ? new Date(m.dateDebut).toLocaleDateString('fr') : '—'}</td>
            <td>${m.dateFin ? new Date(m.dateFin).toLocaleDateString('fr') : '—'}</td>
            <td><span class="${m.statut === 'Terminée' ? 'status-connected' : m.statut === 'En cours' ? 'status-warning' : 'status-disconnected'}">${m.statut || 'Planifiée'}</span></td>
            <td class="action-icons">
                <i class="fas fa-edit" onclick="editMaintenance('${m.id}')"></i>
                <i class="fas fa-trash" onclick="deleteMaintenance('${m.id}')"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
    initSearch('#maintenance-table', '#searchMaintenance', [0,1,2,3,8]);
}

function saveMaintenance() {
    const data = {
        ordreReparation: document.getElementById('maint-ordre').value,
        vehicule: document.getElementById('maint-vehicule').value,
        type: document.getElementById('maint-type').value,
        composant: document.getElementById('maint-composant').value,
        coutPiece: parseFloat(document.getElementById('maint-coutPiece').value) || 0,
        coutMainOeuvre: parseFloat(document.getElementById('maint-coutMain').value) || 0,
        dateDebut: document.getElementById('maint-dateDebut').value,
        dateFin: document.getElementById('maint-dateFin').value || null,
        statut: document.getElementById('maint-statut').value
    };
    if (!data.ordreReparation || !data.vehicule || !data.composant || !data.dateDebut) {
        alert('Ordre, véhicule, composant et date début sont requis');
        return;
    }
    apiCall('/maintenances', { method: 'POST', body: JSON.stringify(data) })
        .then(() => {
            loadMaintenances();
            document.getElementById('maint-ordre').value = '';
            document.getElementById('maint-composant').value = '';
            document.getElementById('maint-coutPiece').value = '0';
            document.getElementById('maint-coutMain').value = '0';
            document.getElementById('maint-dateDebut').value = '';
            document.getElementById('maint-dateFin').value = '';
            document.getElementById('maint-type').value = 'Préventive';
            document.getElementById('maint-statut').value = 'Planifiée';
        })
        .catch(err => alert(err.message));
}

function editMaintenance(id) {
    const m = maintenances.find(m => m.id === id);
    if (!m) return;
    editingId = id;
    document.getElementById('edit-maint-ordre').value = m.ordreReparation || '';
    document.getElementById('edit-maint-vehicule').value = m.vehicule?._id || m.vehicule;
    document.getElementById('edit-maint-type').value = m.type || 'Préventive';
    document.getElementById('edit-maint-composant').value = m.composant;
    document.getElementById('edit-maint-coutPiece').value = m.coutPiece || 0;
    document.getElementById('edit-maint-coutMain').value = m.coutMainOeuvre || 0;
    document.getElementById('edit-maint-dateDebut').value = m.dateDebut ? m.dateDebut.split('T')[0] : '';
    document.getElementById('edit-maint-dateFin').value = m.dateFin ? m.dateFin.split('T')[0] : '';
    document.getElementById('edit-maint-statut').value = m.statut || 'Planifiée';
    document.getElementById('modal-maintenance').style.display = 'block';
}

function updateMaintenance() {
    const data = {
        ordreReparation: document.getElementById('edit-maint-ordre').value,
        vehicule: document.getElementById('edit-maint-vehicule').value,
        type: document.getElementById('edit-maint-type').value,
        composant: document.getElementById('edit-maint-composant').value,
        coutPiece: parseFloat(document.getElementById('edit-maint-coutPiece').value) || 0,
        coutMainOeuvre: parseFloat(document.getElementById('edit-maint-coutMain').value) || 0,
        dateDebut: document.getElementById('edit-maint-dateDebut').value,
        dateFin: document.getElementById('edit-maint-dateFin').value || null,
        statut: document.getElementById('edit-maint-statut').value
    };
    if (!data.ordreReparation || !data.vehicule || !data.composant || !data.dateDebut) {
        alert('Ordre, véhicule, composant et date début sont requis');
        return;
    }
    apiCall(`/maintenances/${editingId}`, { method: 'PUT', body: JSON.stringify(data) })
        .then(() => {
            closeModal();
            loadMaintenances();
        })
        .catch(err => alert(err.message));
}

function deleteMaintenance(id) {
    if (!confirm('Supprimer cette maintenance ?')) return;
    apiCall(`/maintenances/${id}`, { method: 'DELETE' })
        .then(() => loadMaintenances())
        .catch(err => alert(err.message));
}

function initModal() {
    const modal = document.getElementById('modal-maintenance');
    const span = modal.querySelector('.close');
    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal-maintenance').style.display = 'none';
}

window.saveMaintenance = saveMaintenance;
window.editMaintenance = editMaintenance;
window.deleteMaintenance = deleteMaintenance;
window.updateMaintenance = updateMaintenance;