document.addEventListener('DOMContentLoaded', () => {
    const episodes = [];
    const apiFiles = [
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-01-10.json',
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-11-20.json'
    ];

    const loadEpisodes = async () => {
        for (const file of apiFiles) {
            const response = await fetch(file);
            const data = await response.json();
            episodes.push(...data.episodes);
        }
        renderEpisodes(episodes);
    };

    const renderEpisodes = (data) => {
        const episodeList = document.getElementById('episode-list');
        episodeList.innerHTML = '';

        data.forEach(episode => {
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
                <div class="episode-cell">${episode.plot}</div>
            `;
            episodeList.appendChild(row);
        });
    };

    const applyFilters = () => {
        const nameFilter = document.getElementById('name-filter').value.toLowerCase();
        const eraFilter = document.getElementById('era-filter').value;
        const doctorFilter = document.getElementById('doctor-filter').value.toLowerCase();
        const companionFilter = document.getElementById('companion-filter').value.toLowerCase();

        const filteredEpisodes = episodes.filter(episode => {
            const nameMatch = episode.title.toLowerCase().includes(nameFilter);
            const eraMatch = !eraFilter || episode.era === eraFilter;
            const doctorMatch = episode.doctor.actor.toLowerCase().includes(doctorFilter);
            const companionMatch = episode.companion ? episode.companion.actor.toLowerCase().includes(companionFilter) : true;
            return nameMatch && eraMatch && doctorMatch && companionMatch;
        });

        renderEpisodes(filteredEpisodes);
    };

    const sortEpisodes = (column, order) => {
        const sortedEpisodes = [...episodes].sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            if (column === 'broadcast_date') {
                valA = new Date(a.broadcast_date).getFullYear();
                valB = new Date(b.broadcast_date).getFullYear();
            } else if (column === 'doctor') {
                valA = a.doctor.actor;
                valB = b.doctor.actor;
            }

            if (valA > valB) return order === 'asc' ? 1 : -1;
            if (valA < valB) return order === 'asc' ? -1 : 1;
            return 0;
        });
        renderEpisodes(sortedEpisodes);
    };

    document.getElementById('name-filter').addEventListener('input', applyFilters);
    document.getElementById('era-filter').addEventListener('change', applyFilters);
    document.getElementById('doctor-filter').addEventListener('change', applyFilters);
    document.getElementById('companion-filter').addEventListener('change', applyFilters);

    loadEpisodes();
});
