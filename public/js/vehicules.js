import { apiCall, initSearch } from './script.js';

let vehicles = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadVehicules();
    initModal();
});

async function loadVehicules() {
    try {
        vehicles = await apiCall('/vehicles');
        renderTable();
    } catch (err) {
        alert(err.message);
    }
}

function renderTable() {
    const tbody = document.querySelector('#vehicules-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    vehicles.forEach(v => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${v.immat}</td>
            <td>${v.marque}</td>
            <td>${v.modele}</td>
            <td><span class="${v.statut === 'disponible' ? 'status-connected' : v.statut === 'en mission' ? 'status-warning' : 'status-disconnected'}">${v.statut}</span></td>
            <td class="action-icons">
                <i class="fas fa-edit" onclick="editVehicule('${v.id}')"></i>
                <i class="fas fa-trash" onclick="deleteVehicule('${v.id}')"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
    initSearch('#vehicules-table', '#searchMission', [0,1,2,3]);
}

function addVehicule() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Ajouter un véhicule';
    document.getElementById('veh-immat').value = '';
    document.getElementById('veh-marque').value = '';
    document.getElementById('veh-modele').value = '';
    document.getElementById('veh-statut').value = 'disponible';
    document.getElementById('modal-vehicule').style.display = 'block';
}

function editVehicule(id) {
    const v = vehicles.find(v => v.id === id);
    if (!v) return;
    editingId = id;
    document.getElementById('modal-title').textContent = 'Modifier le véhicule';
    document.getElementById('veh-immat').value = v.immat;
    document.getElementById('veh-marque').value = v.marque;
    document.getElementById('veh-modele').value = v.modele;
    document.getElementById('veh-statut').value = v.statut;
    document.getElementById('modal-vehicule').style.display = 'block';
}

async function saveVehicule() {
    const data = {
        immat: document.getElementById('veh-immat').value,
        marque: document.getElementById('veh-marque').value,
        modele: document.getElementById('veh-modele').value,
        statut: document.getElementById('veh-statut').value
    };
    try {
        if (editingId) {
            await apiCall(`/vehicles/${editingId}`, { method: 'PUT', body: JSON.stringify(data) });
        } else {
            await apiCall('/vehicles', { method: 'POST', body: JSON.stringify(data) });
        }
        closeModal();
        loadVehicules();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteVehicule(id) {
    if (!confirm('Supprimer ce véhicule ?')) return;
    try {
        await apiCall(`/vehicles/${id}`, { method: 'DELETE' });
        loadVehicules();
    } catch (err) {
        alert(err.message);
    }
}

function initModal() {
    const modal = document.getElementById('modal-vehicule');
    const span = modal.querySelector('.close');
    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal-vehicule').style.display = 'none';
}

window.addVehicule = addVehicule;
window.editVehicule = editVehicule;
window.deleteVehicule = deleteVehicule;
window.saveVehicule = saveVehicule;