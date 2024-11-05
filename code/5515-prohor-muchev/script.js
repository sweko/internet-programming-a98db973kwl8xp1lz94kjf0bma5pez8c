document.addEventListener('DOMContentLoaded', () => {
    const episodeRowsContainer = document.getElementById('episode-rows-container');
    const eraFilter = document.getElementById('era-filter');
    const doctorFilter = document.getElementById('doctor-filter');
    const companionFilter = document.getElementById('companion-filter');

    const apiUrl = 'https://raw.githubusercontent.com/Deadlyforce16/internet-programming-5515-prohor-muchev/main/data/doctor-who-episodes.json';
    let allEpisodes = [];
    let sortDirection = {}; // To track sort direction for each column

    const fetchEpisodes = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allEpisodes = data.episodes; // Store all episodes for filtering
            displayEpisodes(allEpisodes);
            populateFilters(allEpisodes);
            initializeSorting(); // Initialize sorting functionality
        } catch (error) {
            console.error('Error fetching the episodes:', error);
        }
    };

    const displayEpisodes = (episodes) => {
        // Clear previous contents except for the header
        episodeRowsContainer.querySelectorAll('.episode-row').forEach(row => row.remove());

        episodes.forEach(episode => {
            const episodeRow = document.createElement('div');
            episodeRow.classList.add('episode-row');

            const broadcastYear = new Date(episode.broadcast_date).getFullYear();
            const castCount = episode.cast.length;
            const castNames = episode.cast.map(c => `${c.actor} (${c.character})`).join(', ');
            const truncatedPlot = episode.plot.length > 50 ? episode.plot.substring(0, 50) + '...' : episode.plot;

            episodeRow.innerHTML = `
                <div class="episode-cell">${episode.rank}</div>
                <div class="episode-cell">${episode.title}</div>
                <div class="episode-cell">${episode.series}</div>
                <div class="episode-cell">
                    <img src="images/${episode.era.toLowerCase()}.jpg" alt="${episode.era} Era" class="era-icon">
                    ${episode.era}
                </div>
                <div class="episode-cell">${broadcastYear}</div>
                <div class="episode-cell">${episode.director}</div>
                <div class="episode-cell">${episode.writer}</div>
                <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
                <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : 'N/A'}</div>
                <div class="episode-cell">${castCount}</div>
                <div class="episode-cell plot-preview">${truncatedPlot}</div>
            `;

            episodeRowsContainer.appendChild(episodeRow);
        });
    };

    const populateFilters = (episodes) => {
        const eras = new Set();
        const doctors = new Set();
        const companions = new Set();

        episodes.forEach(episode => {
            eras.add(episode.era);
            doctors.add(episode.doctor.actor);
            if (episode.companion) {
                companions.add(episode.companion.actor);
            }
        });

        eras.forEach(era => {
            const option = document.createElement('option');
            option.value = era;
            option.textContent = era;
            eraFilter.appendChild(option);
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

        // Add event listeners for filters
        eraFilter.addEventListener('change', filterEpisodes);
        doctorFilter.addEventListener('change', filterEpisodes);
        companionFilter.addEventListener('change', filterEpisodes);
        document.getElementById('name-filter').addEventListener('input', filterEpisodes);
    };

    const filterEpisodes = () => {
        const filteredEpisodes = allEpisodes.filter(episode => {
            const matchesEra = !eraFilter.value || episode.era === eraFilter.value;
            const matchesDoctor = !doctorFilter.value || episode.doctor.actor === doctorFilter.value;
            const matchesCompanion = !companionFilter.value || (episode.companion && episode.companion.actor === companionFilter.value);
            const nameFilterValue = document.getElementById('name-filter').value.toLowerCase();
            const matchesName = episode.title.toLowerCase().includes(nameFilterValue);

            return matchesEra && matchesDoctor && matchesCompanion && matchesName;
        });

        displayEpisodes(filteredEpisodes);
    };

    const initializeSorting = () => {
        const headerCells = episodeRowsContainer.querySelectorAll('.header-cell');

        headerCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const sortKey = cell.getAttribute('data-sort');
                sortEpisodes(sortKey);
            });
        });
    };

    const sortEpisodes = (key) => {
        const direction = sortDirection[key] === 'asc' ? 'desc' : 'asc';
        sortDirection[key] = direction;

        const sortedEpisodes = [...allEpisodes].sort((a, b) => {
            const aValue = getSortValue(a, key);
            const bValue = getSortValue(b, key);

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        displayEpisodes(sortedEpisodes);
    };

    const getSortValue = (episode, key) => {
        switch (key) {
            case 'rank':
                return episode.rank;
            case 'name':
                return episode.title.toLowerCase();
            case 'series':
                return episode.series;
            case 'era':
                return episode.era;
            case 'broadcast':
                return new Date(episode.broadcast_date).getTime();
            case 'director':
                return episode.director.toLowerCase();
            case 'writer':
                return episode.writer.toLowerCase();
            case 'doctor':
                return episode.doctor.actor.toLowerCase();
            case 'companion':
                return episode.companion ? episode.companion.actor.toLowerCase() : '';
            case 'cast':
                return episode.cast.length;
            case 'plot':
                return episode.plot.toLowerCase();
            default:
                return '';
        }
    };

    fetchEpisodes();
});





