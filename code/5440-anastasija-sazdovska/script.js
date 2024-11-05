document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application when the DOM is fully loaded
});
const apiUrl = 'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json';
let episodes = [];
let currentSortColumn = '';
let currentSortOrder = 'asc';

document.addEventListener('DOMContentLoaded', async () => {
    episodes = await fetchEpisodes();
    populateFilters(episodes);
    renderEpisodes(episodes);

    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener('click', () => {
            const sortField = header.getAttribute('data-sort');
            sortEpisodes(sortField);
        });
    });

    document.getElementById('name-filter').addEventListener('input', applyFilters);
    document.getElementById('era-filter').addEventListener('change', applyFilters);
    document.getElementById('doctor-filter').addEventListener('change', applyFilters);
    document.getElementById('companion-filter').addEventListener('change', applyFilters);
});

async function fetchEpisodes() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.episodes;
}

function renderEpisodes(episodes) {
    const episodesList = document.querySelector('.episodes-list');
    episodesList.querySelectorAll('.episode-row').forEach(row => row.remove());
    episodes.forEach(episode => {
        const row = document.createElement('div');
        row.className = 'episode-row';
        row.innerHTML = `
            <div class="episode-cell">${episode.rank}</div>
            <div class="episode-cell">${episode.title}</div>
            <div class="episode-cell">${episode.series}</div>
            <div class="episode-cell">${episode.era}</div>
            <div class="episode-cell">${new Date(episode.broadcast_date).getFullYear()}</div>
            <div class="episode-cell">${episode.director}</div>
            <div class="episode-cell">${episode.writer}</div>
            <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
            <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : 'N/A'}</div>
            <div class="episode-cell">${episode.cast.length}</div>
            <div class="episode-cell plot-preview">${truncatePlot(episode.plot)}</div>
        `;
        episodesList.appendChild(row);
    });
}

function applyFilters() {
    const nameFilter = document.getElementById('name-filter').value.toLowerCase();
    const eraFilter = document.getElementById('era-filter').value;
    const doctorFilter = document.getElementById('doctor-filter').value;
    const companionFilter = document.getElementById('companion-filter').value;
    const filteredEpisodes = episodes.filter(episode => {
        return (
            (episode.title.toLowerCase().includes(nameFilter)) &&
            (eraFilter === '' || episode.era === eraFilter) &&
            (doctorFilter === '' || episode.doctor.actor === doctorFilter) &&
            (companionFilter === '' || (episode.companion && episode.companion.actor === companionFilter))
        );
    });
    renderEpisodes(filteredEpisodes);
}

function sortEpisodes(field) {
    if (currentSortColumn === field) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = field;
        currentSortOrder = 'asc';
    }
    episodes.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'broadcast_date') {
            valA = new Date(a.broadcast_date);
            valB = new Date(b.broadcast_date);
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return currentSortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    renderEpisodes(episodes);
    document.querySelectorAll('.header-cell').forEach(header => header.classList.remove('sorted-asc', 'sorted-desc'));
    const currentHeader = document.querySelector(`.header-cell[data-sort="${field}"]`);
    currentHeader.classList.add(currentSortOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');
}
function populateFilters(episodes) {
    const eras = new Set();
    const doctors = new Set();
    const companions = new Set();

    episodes.forEach(episode => {
        eras.add(episode.era);
        doctors.add(episode.doctor.actor);
        if (episode.companion) companions.add(episode.companion.actor);
    });

    populateSelectOptions('era-filter', eras);
    populateSelectOptions('doctor-filter', doctors);
    populateSelectOptions('companion-filter', companions);
}
function populateSelectOptions(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}
function truncatePlot(plot) {
    return plot.length > 50 ? plot.slice(0, 47) + '...' : plot;
}
