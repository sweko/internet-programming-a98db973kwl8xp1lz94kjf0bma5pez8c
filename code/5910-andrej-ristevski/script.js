document.addEventListener('DOMContentLoaded', () => {

            const episodesContainer = document.querySelector('.episodes-list');
            const nameFilterInput = document.getElementById('name-filter');
            const eraFilterSelect = document.getElementById('era-filter');
            const doctorFilterSelect = document.getElementById('doctor-filter');
            const companionFilterSelect = document.getElementById('companion-filter');


            let episodes = [];
            let filteredEpisodes = [];
            let currentSort = { key: 'rank', direction: 'asc' };


            const fetchEpisodes = async() => {
                try {
                    const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
                    const data = await response.json();
                    episodes = data.episodes;
                    filteredEpisodes = episodes;
                    initializeFilters();
                    renderEpisodes();
                } catch (error) {
                    console.error('Error fetching episodes:', error);
                }
            };


            const initializeFilters = () => {

                const eras = [...new Set(episodes.map(ep => ep.era))];
                const doctors = [...new Set(episodes.map(ep => ep.doctor.actor))];
                const companions = [...new Set(episodes.map(ep => ep.companion ? ep.companion.actor : null).filter(Boolean))];

                eras.forEach(era => {
                    const option = document.createElement('option');
                    option.value = era;
                    option.textContent = era;
                    eraFilterSelect.appendChild(option);
                });

                doctors.forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor;
                    option.textContent = doctor;
                    doctorFilterSelect.appendChild(option);
                });

                companions.forEach(companion => {
                    const option = document.createElement('option');
                    option.value = companion;
                    option.textContent = companion;
                    companionFilterSelect.appendChild(option);
                });
            };


            const renderEpisodes = () => {
                    episodesContainer.innerHTML = '';

                    filteredEpisodes.forEach(episode => {
                                const episodeRow = document.createElement('div');
                                episodeRow.classList.add('episode-row');

                                episodeRow.innerHTML = `
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

    episodesContainer.appendChild(episodeRow);
});
};


const truncatePlot = (plot) => {
if (plot.length > 50) return plot.substring(0, 50) + '...';
return plot;
};


const applyFilters = () => {
const nameFilter = nameFilterInput.value.toLowerCase();
const eraFilter = eraFilterSelect.value;
const doctorFilter = doctorFilterSelect.value;
const companionFilter = companionFilterSelect.value;

filteredEpisodes = episodes.filter(episode => {
    return (
        episode.title.toLowerCase().includes(nameFilter) &&
        (eraFilter === '' || episode.era === eraFilter) &&
        (doctorFilter === '' || episode.doctor.actor === doctorFilter) &&
        (companionFilter === '' || (episode.companion && episode.companion.actor === companionFilter))
    );
});

applySort();
renderEpisodes();
};


const applySort = () => {
filteredEpisodes.sort((a, b) => {
    const valueA = a[currentSort.key];
    const valueB = b[currentSort.key];

    if (typeof valueA === 'string') {
        return currentSort.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    } else {
        return currentSort.direction === 'asc' ? valueA - valueB : valueB - valueA;
    }
});
};


document.querySelectorAll('.header-cell').forEach(headerCell => {
headerCell.addEventListener('click', () => {
    const sortKey = headerCell.dataset.sort;

    if (currentSort.key === sortKey) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.key = sortKey;
        currentSort.direction = 'asc';
    }

    applySort();
    renderEpisodes();
});
});


nameFilterInput.addEventListener('input', applyFilters);
eraFilterSelect.addEventListener('change', applyFilters);
doctorFilterSelect.addEventListener('change', applyFilters);
companionFilterSelect.addEventListener('change', applyFilters);


fetchEpisodes();
});