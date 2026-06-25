import { apiCall, initSearch } from './script.js';

let fuels = [];
let vehicles = [];
let editingId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadVehicles();
    await loadFuels();
    initModal();
});

async function loadVehicles() {
    try {
        vehicles = await apiCall('/vehicles');
        const select = document.getElementById('fuel-vehicule');
        const editSelect = document.getElementById('edit-fuel-vehicule');
        const options = vehicles.map(v => `<option value="${v.id}">${v.immat}</option>`).join('');
        select.innerHTML = options;
        editSelect.innerHTML = options;
    } catch (err) {
        console.error(err);
    }
}

async function loadFuels() {
    try {
        fuels = await apiCall('/fuel');
        renderTable();
    } catch (err) {
        console.error(err);
    }
}

function renderTable() {
    const tbody = document.querySelector('#fuel-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    fuels.forEach(f => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${f.vehicule?.immat || 'Inconnu'}</td>
            <td>${new Date(f.date).toLocaleDateString('fr')}</td>
            <td>${f.litres} L</td>
            <td>${f.montant} DH</td>
            <td class="action-icons">
                <i class="fas fa-edit" onclick="editFuel('${f.id}')"></i>
                <i class="fas fa-trash" onclick="deleteFuel('${f.id}')"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
    initSearch('#fuel-table', '#searchCarburant', [0]);
}

function addFuel() {
    const data = {
        vehicule: document.getElementById('fuel-vehicule').value,
        date: document.getElementById('fuel-date').value,
        litres: parseFloat(document.getElementById('fuel-litres').value),
        montant: parseFloat(document.getElementById('fuel-montant').value)
    };
    if (!data.vehicule || !data.date || !data.litres || !data.montant) {
        alert('Tous les champs sont requis');
        return;
    }
    apiCall('/fuel', { method: 'POST', body: JSON.stringify(data) })
        .then(() => {
            loadFuels();
            document.getElementById('fuel-date').value = '';
            document.getElementById('fuel-litres').value = '';
            document.getElementById('fuel-montant').value = '';
        })
        .catch(err => alert(err.message));
}

function editFuel(id) {
    const f = fuels.find(f => f.id === id);
    if (!f) return;
    editingId = id;
    document.getElementById('edit-fuel-vehicule').value = f.vehicule?._id || f.vehicule;
    document.getElementById('edit-fuel-date').value = f.date.split('T')[0];
    document.getElementById('edit-fuel-litres').value = f.litres;
    document.getElementById('edit-fuel-montant').value = f.montant;
    document.getElementById('modal-fuel').style.display = 'block';
}

function updateFuel() {
    const data = {
        vehicule: document.getElementById('edit-fuel-vehicule').value,
        date: document.getElementById('edit-fuel-date').value,
        litres: parseFloat(document.getElementById('edit-fuel-litres').value),
        montant: parseFloat(document.getElementById('edit-fuel-montant').value)
    };
    apiCall(`/fuel/${editingId}`, { method: 'PUT', body: JSON.stringify(data) })
        .then(() => {
            closeModal();
            loadFuels();
        })
        .catch(err => alert(err.message));
}

function deleteFuel(id) {
    if (!confirm('Supprimer cette entrée ?')) return;
    apiCall(`/fuel/${id}`, { method: 'DELETE' })
        .then(() => loadFuels())
        .catch(err => alert(err.message));
}

function initModal() {
    const modal = document.getElementById('modal-fuel');
    const span = modal.querySelector('.close');
    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal-fuel').style.display = 'none';
}

window.addFuel = addFuel;
window.editFuel = editFuel;
window.deleteFuel = deleteFuel;
window.updateFuel = updateFuel;