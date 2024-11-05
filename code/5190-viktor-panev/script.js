document.addEventListener('DOMContentLoaded', () => {
});
let episodes = [];
let currentSort = { column: null, order: 'asc' };

async function loadEpisodes() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
        const data = await response.json();
        episodes = data.episodes;
        populateFilters();
        displayEpisodes(episodes);
    } catch (error) {
        console.error("Failed to load episodes:", error);
    }
}

function populateFilters() {
    const eraFilter = document.getElementById('era-filter');
    const doctorFilter = document.getElementById('doctor-filter');
    const companionFilter = document.getElementById('companion-filter');
    
    const eras = [...new Set(episodes.map(ep => ep.era))];
    const doctors = [...new Set(episodes.map(ep => ep.doctor.actor))];
    const companions = [...new Set(episodes.filter(ep => ep.companion).map(ep => ep.companion.actor))];
    
    eras.forEach(era => eraFilter.innerHTML += `<option value="${era}">${era}</option>`);
    doctors.forEach(doc => doctorFilter.innerHTML += `<option value="${doc}">${doc}</option>`);
    companions.forEach(comp => companionFilter.innerHTML += `<option value="${comp}">${comp}</option>`);
}

function displayEpisodes(episodes) {
    const episodesList = document.querySelector('.episodes-list');
    const episodeRows = episodes.map(episode => {
        const companion = episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : 'N/A';
        return `
            <div class="episode-row">
                <div class="episode-cell">${episode.rank}</div>
                <div class="episode-cell">${episode.title}</div>
                <div class="episode-cell">${episode.series}</div>
                <div class="episode-cell">${episode.era}</div>
                <div class="episode-cell">${new Date(episode.broadcast_date).getFullYear()}</div>
                <div class="episode-cell">${episode.director}</div>
                <div class="episode-cell">${episode.writer}</div>
                <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
                <div class="episode-cell">${companion}</div>
                <div class="episode-cell">${episode.cast.length}</div>
                <div class="episode-cell plot-preview">${episode.plot}</div>
            </div>
        `;
    }).join('');
    episodesList.innerHTML = document.querySelector('.episodes-header').outerHTML + episodeRows;
}

function sortEpisodes(column) {
    if (currentSort.column === column) {
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.order = 'asc';
    }

    episodes.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        if (column === 'broadcast_date') {
            aValue = new Date(a.broadcast_date);
            bValue = new Date(b.broadcast_date);
        } else if (column === 'doctor' || column === 'companion') {
            aValue = a[column] ? a[column].actor : '';
            bValue = b[column] ? b[column].actor : '';
        } else if (column === 'cast') {
            aValue = a.cast.length;
            bValue = b.cast.length;
        }

        if (aValue > bValue) return currentSort.order === 'asc' ? 1 : -1;
        if (aValue < bValue) return currentSort.order === 'asc' ? -1 : 1;
        return 0;
    });

    updateSortArrows(column);
    displayEpisodes(episodes);
}

function updateSortArrows(column) {
    document.querySelectorAll('.header-cell').forEach(header => {
        header.classList.remove('sorted-asc', 'sorted-desc');
    });
    const header = document.querySelector(`.header-cell[data-sort="${column}"]`);
    header.classList.add(currentSort.order === 'asc' ? 'sorted-asc' : 'sorted-desc');
}

function applyFilters() {
    const nameFilter = document.getElementById('name-filter').value.toLowerCase();
    const eraFilter = document.getElementById('era-filter').value;
    const doctorFilter = document.getElementById('doctor-filter').value;
    const companionFilter = document.getElementById('companion-filter').value;

    const filteredEpisodes = episodes.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameFilter);
        const matchesEra = !eraFilter || episode.era === eraFilter;
        const matchesDoctor = !doctorFilter || episode.doctor.actor === doctorFilter;
        const matchesCompanion = !companionFilter || (episode.companion && episode.companion.actor === companionFilter);

        return matchesName && matchesEra && matchesDoctor && matchesCompanion;
    });

    displayEpisodes(filteredEpisodes);
}

document.addEventListener("DOMContentLoaded", () => {
    loadEpisodes();

    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');
            sortEpisodes(column);
        });
    });

    document.getElementById('name-filter').addEventListener('input', applyFilters);
    document.getElementById('era-filter').addEventListener('change', applyFilters);
    document.getElementById('doctor-filter').addEventListener('change', applyFilters);
    document.getElementById('companion-filter').addEventListener('change', applyFilters);
});
