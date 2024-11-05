document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json';
    const episodesContainer = document.getElementById('episodes-container');
    const nameFilter = document.getElementById('name-filter');
    const eraFilter = document.getElementById('era-filter');
    const doctorFilter = document.getElementById('doctor-filter');
    const companionFilter = document.getElementById('companion-filter');
    let episodesData = [];

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            episodesData = data.episodes;
            populateFilters();
            renderEpisodes(episodesData);
        });

    function renderEpisodes(episodes) {
        episodesContainer.innerHTML = '';
        episodes.forEach(ep => {
            const row = document.createElement('div');
            row.classList.add('episode-row');
            row.innerHTML = `
                <div class="episode-cell">${ep.rank}</div>
                <div class="episode-cell">${ep.title}</div>
                <div class="episode-cell">${ep.series}</div>
                <div class="episode-cell">${ep.era}</div>
                <div class="episode-cell">${ep.broadcast_date.slice(0, 4)}</div>
                <div class="episode-cell">${ep.director}</div>
                <div class="episode-cell">${ep.writer}</div>
                <div class="episode-cell">${ep.doctor.actor} (${ep.doctor.incarnation})</div>
                <div class="episode-cell">${ep.companion ? `${ep.companion.actor} (${ep.companion.character})` : 'N/A'}</div>
                <div class="episode-cell">${ep.cast.length}</div>
                <div class="episode-cell plot-preview">${ep.plot}</div>
            `;
            episodesContainer.appendChild(row);
        });
    }

    function populateFilters() {
       
        const eras = new Set(episodesData.map(ep => ep.era));
        const doctors = new Set(episodesData.map(ep => ep.doctor.actor));
        const companions = new Set(episodesData.map(ep => ep.companion?.actor).filter(Boolean));

        eras.forEach(era => eraFilter.add(new Option(era, era)));
        doctors.forEach(doc => doctorFilter.add(new Option(doc, doc)));
        companions.forEach(comp => companionFilter.add(new Option(comp, comp)));
    }

    [nameFilter, eraFilter, doctorFilter, companionFilter].forEach(filter =>
        filter.addEventListener('input', filterEpisodes)
    );

    function filterEpisodes() {
        const nameValue = nameFilter.value.toLowerCase();
        const eraValue = eraFilter.value;
        const doctorValue = doctorFilter.value;
        const companionValue = companionFilter.value;

        const filtered = episodesData.filter(ep => {
            const matchesName = ep.title.toLowerCase().includes(nameValue);
            const matchesEra = !eraValue || ep.era === eraValue;
            const matchesDoctor = !doctorValue || ep.doctor.actor === doctorValue;
            const matchesCompanion = !companionValue || ep.companion?.actor === companionValue;
            return matchesName && matchesEra && matchesDoctor && matchesCompanion;
        });

        renderEpisodes(filtered);
    }

    
    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.getAttribute('data-sort');
            const sorted = [...episodesData].sort((a, b) => {
                const valA = a[sortBy]?.toString().toLowerCase() || '';
                const valB = b[sortBy]?.toString().toLowerCase() || '';
                return valA.localeCompare(valB);
            });
            renderEpisodes(sorted);
        });
    });
});
