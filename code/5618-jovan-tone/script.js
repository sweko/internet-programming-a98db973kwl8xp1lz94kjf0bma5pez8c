let episodes = [];
let allEpisodes = [];
let currentSortColumn = '';
let sortAscending = true;

async function fetchEpisodes() {
    const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
    const data = await response.json();
    allEpisodes = data.episodes;
    episodes = [...allEpisodes]; 
    populateFilters();
    displayEpisodes();
}

function populateFilters() {
    const doctors = [...new Set(allEpisodes.map(ep => ep.doctor.actor))];
    const companions = [...new Set(allEpisodes.map(ep => ep.companion?.actor).filter(Boolean))];

    const doctorFilter = document.getElementById('filter-doctor');
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorFilter.appendChild(option);
    });

    const companionFilter = document.getElementById('filter-companion');
    companions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion;
        option.textContent = companion;
        companionFilter.appendChild(option);
    });
}

function displayEpisodes() {
    const tableBody = document.getElementById('episode-list');
    tableBody.innerHTML = '';

    episodes.forEach(ep => {
        const broadcastYear = new Date(ep.broadcast_date).getFullYear();
        const broadcastDecade = Math.floor(broadcastYear / 10) * 10 + 's';

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${ep.rank}</td>
            <td>${ep.title}</td>
            <td>${ep.series}</td>
            <td><img src="https://github.com/sooprim/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/raw/main/images/${ep.era.toLowerCase()}.jpg" alt="${ep.era} Era" class="era-icon"></td>
            <td>${ep.era}</td> <!-- Added the era text here -->
            <td>${broadcastYear}</td>
            <td>${broadcastDecade}</td>
            <td>${ep.director}</td>
            <td>${ep.writer}</td>
            <td>${ep.doctor.actor} (${ep.doctor.incarnation})</td>
            <td>${ep.companion ? `${ep.companion.actor} (${ep.companion.character})` : 'N/A'}</td>
            <td>${ep.cast.length} - ${getCastList(ep.cast)}</td>
            <td>${getTruncatedPlot(ep.plot)}</td>
        `;

        tableBody.appendChild(row);
    });
}

function getCastList(cast) {
    let castNames = cast.map(c => `${c.actor} (${c.character})`).sort();
    if (castNames.length > 5) {
        castNames = castNames.slice(0, 5).concat('...');
    }
    return castNames.join(', ').replace(/, ([^,]*)$/, ' & $1');
}

function getTruncatedPlot(plot) {
    const words = plot.split(' ');
    if (words.length > 10) {
        return words.slice(0, 10).join(' ') + '...';
    }
    return plot;
}

function sortTable(column) {
    if (currentSortColumn === column) {
        sortAscending = !sortAscending;
    } else {
        currentSortColumn = column;
        sortAscending = true;
    }

    episodes.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        if (column === 'broadcast_year') {
            valA = new Date(a.broadcast_date).getFullYear();
            valB = new Date(b.broadcast_date).getFullYear();
        } else if (column === 'broadcast_decade') {
            valA = Math.floor(new Date(a.broadcast_date).getFullYear() / 10) * 10;
            valB = Math.floor(new Date(b.broadcast_date).getFullYear() / 10) * 10;
        } else if (column === 'doctor') {
            valA = a.doctor.actor;
            valB = b.doctor.actor;
        } else if (column === 'companion') {
            valA = a.companion ? a.companion.actor : '';
            valB = b.companion ? b.companion.actor : '';
        }

        if (valA < valB) return sortAscending ? -1 : 1;
        if (valA > valB) return sortAscending ? 1 : -1;
        return 0;
    });

    displayEpisodes();
    updateSortArrows(column);
}

function updateSortArrows(column) {
    const headers = document.querySelectorAll('th');
    headers.forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });

    const header = Array.from(headers).find(th => th.textContent.trim().toLowerCase().includes(column.toLowerCase()));
    if (header) {
        header.classList.add(sortAscending ? 'sort-asc' : 'sort-desc');
    }
}

function applyFilters() {
    const nameFilter = document.getElementById('filter-name').value.toLowerCase();
    const eraFilter = document.getElementById('filter-era').value;
    const doctorFilter = document.getElementById('filter-doctor').value;
    const companionFilter = document.getElementById('filter-companion').value;

    episodes = allEpisodes.filter(ep => {
        return (
            (!nameFilter || ep.title.toLowerCase().includes(nameFilter)) &&
            (!eraFilter || ep.era === eraFilter) &&
            (!doctorFilter || ep.doctor.actor === doctorFilter) &&
            (!companionFilter || ep.companion?.actor === companionFilter)
        );
    });

    displayEpisodes();
}

function resetFilters() {
    document.getElementById('filter-name').value = '';
    document.getElementById('filter-era').value = '';
    document.getElementById('filter-doctor').value = '';
    document.getElementById('filter-companion').value = '';

    episodes = [...allEpisodes];
    displayEpisodes();
}

fetchEpisodes();
