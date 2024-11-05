document.addEventListener("DOMContentLoaded", () => {
    const episodesList = document.querySelector('.episodes-list');
    const nameFilter = document.getElementById('name-filter');
    const eraFilter = document.getElementById('era-filter');
    const doctorFilter = document.getElementById('doctor-filter');
    const companionFilter = document.getElementById('companion-filter');
    
    let episodes = [];
    let filteredEpisodes = [];

    async function fetchData() {
        const urls = [
            'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json',
            'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-01-10.json',
            'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-11-20.json',
           
        ];

        for (const url of urls) {
            const response = await fetch(url);
            const data = await response.json();
            episodes = episodes.concat(data.episodes);
        }

        episodes = episodes.slice(0, -20);

        filteredEpisodes = episodes; 
        displayEpisodes(filteredEpisodes);
        populateEraFilter();
        populateDoctorFilter();
        populateCompanionFilter();
    }

    function displayEpisodes(episodes) {
        episodesList.innerHTML = '';
        episodes.forEach(episode => {
            const episodeRow = document.createElement('div');
            episodeRow.classList.add('episode-row');

            const broadcastYear = new Date(episode.broadcast_date).getFullYear();
            const broadcastDecade = Math.floor(broadcastYear / 10) * 10 + 's';
            const plotPreview = episode.plot.length > 50 ? episode.plot.substring(0, 47) + '...' : episode.plot;

            const eraIcon = getEraIcon(episode.era);

            episodeRow.innerHTML = `
                <div class="episode-cell">${episode.rank}</div>
                <div class="episode-cell">${episode.title}</div>
                <div class="episode-cell">${episode.series}</div>
                <div class="episode-cell"><img src="${eraIcon}" alt="${episode.era}" class="era-icon"></div>
                <div class="episode-cell">${broadcastYear} (${broadcastDecade})</div>
                <div class="episode-cell">${episode.director}</div>
                <div class="episode-cell">${episode.writer}</div>
                <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
                <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : ''}</div>
                <div class="episode-cell">${episode.cast.length}</div>
                <div class="episode-cell plot-preview">${plotPreview}</div>
            `;

            episodesList.appendChild(episodeRow);
        });
    }

    function getEraIcon(era) {
        switch (era) {
            case 'Classic':
                return 'images/classic.jpg';
            case 'Modern':
                return 'images/modern.jpg';
            case 'Recent':
                return 'images/recent.jpg';
            default:
                return ''; 
        }
    }

    function populateEraFilter() {
        const eras = Array.from(new Set(episodes.map(ep => ep.era))); 
        eras.unshift('All Eras'); 
        eras.forEach(era => {
            const option = document.createElement('option');
            option.value = era === 'All Eras' ? '' : era;
            option.textContent = era;
            eraFilter.appendChild(option);
        });
    }

    function populateDoctorFilter() {
        const doctors = Array.from(new Set(episodes.map(ep => ep.doctor.actor))).sort(); 
        doctors.forEach( doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctorFilter.appendChild(option);
        });
    }

    function populateCompanionFilter() {
        const companions = Array.from(new Set(episodes.flatMap(ep => ep.companion ? [ep.companion.actor] : []))).sort(); 
        companions.forEach(companion => {
            const option = document.createElement('option');
            option.value = companion;
            option.textContent = companion;
            companionFilter.appendChild(option);
        });
    }

    eraFilter.addEventListener('change', (e) => {
        const era = e.target.value;
        filteredEpisodes = episodes.filter(episode => {
            return era === '' || episode.era === era;
        });
        applyFilters();
    });

    doctorFilter.addEventListener('change', (e) => {
        const doctor = e.target.value;
        filteredEpisodes = episodes.filter(episode => {
            return doctor === '' || episode.doctor.actor === doctor;
        });
        applyFilters();
    });

    companionFilter.addEventListener('change', (e) => {
        const companion = e.target.value;
        filteredEpisodes = episodes.filter(episode => {
            return companion === '' || (episode.companion && episode.companion.actor === companion);
        });
        applyFilters();
    });

    nameFilter.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredEpisodes = episodes.filter(episode => {
            return episode.title.toLowerCase().includes(searchTerm) || episode.plot.toLowerCase().includes(searchTerm);
        });
        applyFilters();
    });

    function applyFilters() {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            const era = eraFilter.value;
            const doctor = doctorFilter.value;
            const companion = companionFilter.value;
            const searchTerm = nameFilter.value.toLowerCase();

            return (era === '' || episode.era === era) &&
                (doctor === '' || episode.doctor.actor === doctor) &&
                (companion === '' || (episode.companion && episode.companion.actor === companion)) &&
                (searchTerm === '' || episode.title.toLowerCase().includes(searchTerm) || episode.plot.toLowerCase().includes(searchTerm));
        });
        displayEpisodes(filteredEpisodes);
    }

    fetchData();
});