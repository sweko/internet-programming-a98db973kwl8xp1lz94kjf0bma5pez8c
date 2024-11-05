async function fetchEpisodes() {
    const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
    const data = await response.json();
    return data.episodes;
}

function renderEpisodes(episodes) {
    const episodesList = document.querySelector('.episodes-list');
    episodesList.innerHTML = ''; 

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
            <div class="episode-cell">${episode.companion ? episode.companion.actor + ' (' + episode.companion.character + ')' : ''}</div>
            <div class="episode-cell">${episode.cast.length}</div>
            <div class="episode-cell plot-preview">${episode.plot}</div>
        `;
        episodesList.appendChild(row);
    });
}

function sortEpisodes(episodes, sortBy, order) {
    return episodes.sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'era') {
            const eraOrder = { 'Classic': 1, 'Modern': 2, 'Recent': 3 };
            comparison = eraOrder[a[sortBy]] - eraOrder[b[sortBy]];
        } else if (sortBy === 'doctor' || sortBy === 'companion') {
            comparison = a[sortBy].actor.localeCompare(b[sortBy].actor);
        } else if (sortBy === 'cast') {
            comparison = a.cast.length - b.cast.length || a.cast[0].actor.localeCompare(b.cast[0].actor);
        } else {
            comparison = a[sortBy] > b[sortBy] ? 1 : -1;
        }
        return order === 'asc' ? comparison : -comparison;
    });
}

function filterEpisodes(episodes) {
    const nameFilter = document.getElementById('name-filter').value.toLowerCase();
    const eraFilter = document.getElementById('era-filter').value;

    return episodes.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameFilter);
        const matchesEra = eraFilter ? episode.era === eraFilter : true;
        return matchesName && matchesEra;
    });
}

async function init() {
    let episodes = await fetchEpisodes();

    renderEpisodes(episodes);

    document.getElementById('name-filter').addEventListener('input', () => {
        const filteredEpisodes = filterEpisodes(episodes);
        renderEpisodes(filteredEpisodes);
    });

    document.getElementById('era-filter').addEventListener('change', () => {
        const filteredEpisodes = filterEpisodes(episodes);
        renderEpisodes(filteredEpisodes);
    });

    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.dataset.sort;
            const currentOrder = header.classList.contains('sorted-asc') ? 'asc' : 'desc';
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

            document.querySelectorAll('.header-cell').forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));

            header.classList.add(newOrder === 'asc' ? 'sorted-asc' : 'sorted-desc');

            const sortedEpisodes = sortEpisodes(episodes, sortBy, newOrder);
            renderEpisodes(sortedEpisodes);
        });
    });
}

window.onload = init;