import { apiCall } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    loadCalendar();
});

async function loadCalendar() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-input').value);
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    let missions = [];
    try {
        const allMissions = await apiCall('/missions');
        missions = allMissions.filter(m => {
            const debut = new Date(m.debut);
            return debut.getMonth() === month && debut.getFullYear() === year;
        });
    } catch (err) {
        console.error(err);
        missions = [
            { debut: '2026-02-04', vehicule: { immat: '12653p1' }, conducteur: 'Ahmed' },
            { debut: '2026-02-08', vehicule: { immat: '987AB12' }, conducteur: 'Mohamed' }
        ];
    }

    document.getElementById('missions-count').textContent = missions.length;

    const container = document.getElementById('calendar-container');
    container.innerHTML = '';

    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    jours.forEach(j => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = j;
        container.appendChild(header);
    });

    for (let i = 0; i < startOffset; i++) {
        container.appendChild(document.createElement('div'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.innerHTML = `<strong>${d}</strong>`;

        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const missionsJour = missions.filter(m => m.debut.startsWith(dateStr));
        missionsJour.forEach(m => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.textContent = `${m.vehicule?.immat || '?'} - ${m.conducteur}`;
            dayDiv.appendChild(eventDiv);
        });

        container.appendChild(dayDiv);
    }
}

window.loadCalendar = loadCalendar;