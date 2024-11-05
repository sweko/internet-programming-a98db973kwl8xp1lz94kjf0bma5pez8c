document.addEventListener('DOMContentLoaded', async () => {
    const data = [];
    let currentSort = { field: 'rank', order: 'asc' };

    const loadEpisodesData = async () => {
        const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
        const jsonData = await response.json();
        data.push(...jsonData.episodes);
        displayEpisodes(data);
        initializeFilters();
    };

    const displayEpisodes = (episodes) => {
        const container = document.querySelector('.episodes-list');
        container.innerHTML = `<div class="episodes-header">
            <div class="header-cell" data-sort="rank">Rank</div>
            <div class="header-cell" data-sort="name">Name</div>
            <div class="header-cell" data-sort="series">Series</div>
            <div class="header-cell" data-sort="era">Era</div>
            <div class="header-cell" data-sort="broadcast">Broadcast Year</div>
            <div class="header-cell" data-sort="director">Director</div>
            <div class="header-cell" data-sort="writer">Writer</div>
            <div class="header-cell" data-sort="doctor">Doctor</div>
            <div class="header-cell" data-sort="companion">Companion</div>
            <div class="header-cell" data-sort="cast">Cast</div>
            <div class="header-cell" data-sort="plot">Plot</div>
            <div class="header-cell">Image</div>
        </div>`;
        
        episodes.forEach(episode => {
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
                <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : 'N/A'}</div>
                <div class="episode-cell">${episode.cast.length}</div>
                <div class="episode-cell plot-preview">${truncatePlot(episode.plot)}</div>
                <div class="episode-cell"><img src="${episode.image}" alt="${episode.title}" class="episode-image"></div>
            `;
            container.appendChild(row);
        });
    };

    const truncatePlot = (plot) => {
        if (plot.length > 50) {
            return plot.substring(0, 50).split(" ").slice(0, -1).join(" ") + "...";
        }
        return plot;
    };

    const sortEpisodes = (field) => {
        currentSort.order = currentSort.field === field && currentSort.order === 'asc' ? 'desc' : 'asc';
        currentSort.field = field;

        data.sort((a, b) => {
            let comparison = 0;
            if (field === 'broadcast') {
                comparison = new Date(a.broadcast_date) - new Date(b.broadcast_date);
            } else if (field === 'rank' || field === 'series' || field === 'cast') {
                comparison = a[field] - b[field];
            } else if (field === 'era') {
                const eraOrder = { "Classic": 1, "Modern": 2, "Recent": 3 };
                comparison = eraOrder[a.era] - eraOrder[b.era];
            } else {
                comparison = a[field].localeCompare(b[field]);
            }
            return currentSort.order === 'asc' ? comparison : -comparison;
        });

        displayEpisodes(data);
    };

    const initializeFilters = () => {
        const nameFilter = document.getElementById("name-filter");
        const eraFilter = document.getElementById("era-filter");
        const doctorFilter = document.getElementById("doctor-filter");
        const companionFilter = document.getElementById("companion-filter");

        const eras = [...new Set(data.map(ep => ep.era))].sort();
        const doctors = [...new Set(data.map(ep => ep.doctor.actor))].sort();
        const companions = [...new Set(data.filter(ep => ep.companion).map(ep => ep.companion.actor))].sort();

        eras.forEach(era => eraFilter.innerHTML += `<option value="${era}">${era}</option>`);
        doctors.forEach(doc => doctorFilter.innerHTML += `<option value="${doc}">${doc}</option>`);
        companions.forEach(comp => companionFilter.innerHTML += `<option value="${comp}">${comp}</option>`);

        nameFilter.addEventListener("input", filterEpisodes);
        eraFilter.addEventListener("change", filterEpisodes);
        doctorFilter.addEventListener("change", filterEpisodes);
        companionFilter.addEventListener("change", filterEpisodes);
    };

    const filterEpisodes = () => {
        const name = document.getElementById("name-filter").value.toLowerCase();
        const era = document.getElementById("era-filter").value;
        const doctor = document.getElementById("doctor-filter").value;
        const companion = document.getElementById("companion-filter").value;

        const filtered = data.filter(ep => {
            return (!name || ep.title.toLowerCase().includes(name)) &&
                   (!era || ep.era === era) &&
                   (!doctor || ep.doctor.actor === doctor) &&
                   (!companion || (ep.companion && ep.companion.actor === companion));
        });

        displayEpisodes(filtered);
    };

    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener("click", () => sortEpisodes(header.dataset.sort));
    });

    await loadEpisodesData();
});
