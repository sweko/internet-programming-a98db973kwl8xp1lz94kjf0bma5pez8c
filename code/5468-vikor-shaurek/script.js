const nameFilter = document.getElementById('name-filter');
const eraFilter = document.getElementById('era-filter');
const doctorFilter = document.getElementById('doctor-filter');
const companionFilter = document.getElementById('companion-filter');
const episodesList = document.querySelector('.episodes-list');
const headerCells = document.querySelectorAll('.header-cell');
let episodes = [];
let sortDirection = {};

async function loadEpisodes() {
    const episodeFiles = [
        'doctor-who-episodes-01-10.json',
        'doctor-who-episodes-11-20.json',
        'doctor-who-episodes-21-30.json',
        'doctor-who-episodes-31-40.json',
        'doctor-who-episodes-41-50.json'
    ];

    try {
        const responses = await Promise.all(
            episodeFiles.map(file => fetch(`https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/main/data/${file}`))
        );

        const data = await Promise.all(responses.map(response => response.json()));
        episodes = data.flatMap(d => d.episodes);
        populateFilters();
        renderEpisodes(episodes);
    } catch (error) {
        console.error("Failed to load episodes:", error);
    }
}

function populateFilters() {
    const doctors = new Set();
    const companions = new Set();

    episodes.forEach(episode => {
        doctors.add(episode.doctor.actor);
        if (episode.companion) {
            companions.add(episode.companion.actor);
        }
    });

    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorFilter.appendChild(option);
    });

    companions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion;
        option.textContent = companion;
        companionFilter.appendChild(option);
    });
}

function renderEpisodes(episodeList) {
    episodesList.innerHTML = ''; 
    episodeList.forEach(episode => {
        const row = createEpisodeRow(episode);
        episodesList.appendChild(row);
    });
}

function createEpisodeRow(episode) {
    const row = document.createElement('div');
    row.classList.add('episode-row');
    row.innerHTML = `
        <div class="episode-cell">${episode.rank}</div>
        <div class="episode-cell">${episode.title}</div>
        <div class="episode-cell">${episode.series}</div>
        <div class="episode-cell">${episode.era}</div>
        <div class="episode-cell">${new Date(episode.broadcast_date).getFullYear()}</div>
        <div class="episode-cell">${episode.director}</div>
        <div class="episode-cell">${episode.writer}</div>
        <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
        <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : ''}</div>
        <div class="episode-cell">${episode.cast.length}</div>
        <div class="episode-cell plot-preview">${truncatePlot(episode.plot)}</div>
    `;
    return row;
}

function truncatePlot(plot) {
    return plot.length > 50 ? plot.substring(0, 47) + '...' : plot;
}

headerCells.forEach(cell => {
    cell.addEventListener('click', () => sortEpisodes(cell.getAttribute('data-sort')));
});

function sortEpisodes(key) {
    const isAscending = sortDirection[key] === 'asc';
    sortDirection = { [key]: isAscending ? 'desc' : 'asc' };

    episodes.sort((a, b) => {
        if (key === 'rank' || key === 'series') {
            return isAscending ? a[key] - b[key] : b[key] - a[key];
        }
        return isAscending ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
    });

    renderEpisodes(episodes);
}

nameFilter.addEventListener('input', () => filterEpisodes());
eraFilter.addEventListener('change', () => filterEpisodes());
doctorFilter.addEventListener('change', () => filterEpisodes());
companionFilter.addEventListener('change', () => filterEpisodes());

function filterEpisodes() {
    const nameValue = nameFilter.value.toLowerCase();
    const eraValue = eraFilter.value;
    const doctorValue = doctorFilter.value;
    const companionValue = companionFilter.value;

    const filteredEpisodes = episodes.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameValue);
        const matchesEra = !eraValue || episode.era === eraValue;
        const matchesDoctor = !doctorValue || episode.doctor.actor === doctorValue;
        const matchesCompanion = !companionValue || (episode.companion && episode.companion.actor === companionValue);
        return matchesName && matchesEra && matchesDoctor && matchesCompanion;
    });

    renderEpisodes(filteredEpisodes);
}

loadEpisodes();


