import { apiCall, requireAdmin, initSearch } from './script.js';

let users = [];
let editingUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    requireAdmin();
    loadStats();
    loadUtilisateurs();
    initTabs();
    initModal();
});

function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => switchTab(e, tab.dataset.tab));
    });
}

function switchTab(event, tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');
}

async function loadStats() {
    try {
        const stats = await apiCall('/stats');
        updateCharts(stats);
        document.getElementById('stat-dispo').textContent = stats.vehicules.dispo;
        document.getElementById('stat-missions').textContent = stats.missionsEnCours;
        const maintElem = document.getElementById('stat-maintenance');
        if (maintElem) maintElem.textContent = stats.maintenancesEnCours || 0;
    } catch (err) {
        console.error(err);
    }
}

function updateCharts(stats) {
    const ctx1 = document.getElementById('chart-vehicules')?.getContext('2d');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Disponibles', 'En mission', 'Maintenance'],
                datasets: [{
                    data: [stats.vehicules.dispo, stats.vehicules.enMission, stats.vehicules.maintenance],
                    backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c']
                }]
            }
        });
    }

    const ctx2 = document.getElementById('chart-cout')?.getContext('2d');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: stats.coutCarburant.map(m => m.mois),
                datasets: [{
                    label: 'Coût carburant (FCFA)',
                    data: stats.coutCarburant.map(m => m.total),
                    backgroundColor: '#3498db'
                }]
            }
        });
    }
}

async function loadUtilisateurs() {
    try {
        users = await apiCall('/users');
        renderUsersTable();
    } catch (err) {
        console.error(err);
    }
}

function renderUsersTable() {
    const tbody = document.querySelector('#utilisateurs-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    users.forEach(u => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${u.nom}</td>
            <td>${u.cin}</td>
            <td>${u.role}</td>
            <td><span class="${u.statut === 'Connecté' ? 'status-connected' : 'status-disconnected'}">${u.statut}</span></td>
            <td class="action-icons">
                <i class="fas fa-edit" onclick="editUtilisateur('${u.id}')"></i>
                <i class="fas fa-trash" onclick="deleteUtilisateur('${u.id}')"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
    initSearch('#utilisateurs-table', '#searchAdm', [0,1,2,3]);
}

function addUtilisateur() {
    editingUserId = null;
    document.getElementById('modal-utilisateur-title').textContent = 'Ajouter un utilisateur';
    document.getElementById('user-nom').value = '';
    document.getElementById('user-cin').value = '';
    document.getElementById('user-role').value = 'user';
    document.getElementById('user-password').value = '';
    document.getElementById('modal-utilisateur').style.display = 'block';
}

function editUtilisateur(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    editingUserId = id;
    document.getElementById('modal-utilisateur-title').textContent = 'Modifier l\'utilisateur';
    document.getElementById('user-nom').value = user.nom;
    document.getElementById('user-cin').value = user.cin;
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-password').value = '';
    document.getElementById('modal-utilisateur').style.display = 'block';
}

function saveUtilisateur() {
    const data = {
        nom: document.getElementById('user-nom').value,
        cin: document.getElementById('user-cin').value,
        role: document.getElementById('user-role').value
    };
    const password = document.getElementById('user-password').value;
    if (password) data.password = password;

    if (!data.nom || !data.cin) {
        alert('Nom et CIN sont requis');
        return;
    }

    const request = editingUserId
        ? apiCall(`/users/${editingUserId}`, { method: 'PUT', body: JSON.stringify(data) })
        : apiCall('/users', { method: 'POST', body: JSON.stringify(data) });

    request
        .then(() => {
            closeModal();
            loadUtilisateurs();
        })
        .catch(err => alert(err.message));
}

function deleteUtilisateur(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    apiCall(`/users/${id}`, { method: 'DELETE' })
        .then(() => loadUtilisateurs())
        .catch(err => alert(err.message));
}

function initModal() {
    const modal = document.getElementById('modal-utilisateur');
    if (!modal) return;
    const span = modal.querySelector('.close');
    span.onclick = closeModal;
    window.onclick = function(event) {
        if (event.target == modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('modal-utilisateur').style.display = 'none';
}

window.switchTab = switchTab;
window.addUtilisateur = addUtilisateur;
window.editUtilisateur = editUtilisateur;
window.deleteUtilisateur = deleteUtilisateur;
window.saveUtilisateur = saveUtilisateur;