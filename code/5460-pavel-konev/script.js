document.addEventListener('DOMContentLoaded', () => {
    const nameFilter = document.getElementById("name-filter");
    const eraFilter = document.getElementById("era-filter");
    const doctorFilter = document.getElementById("doctor-filter");
    const companionFilter = document.getElementById("companion-filter");
    const headers = document.querySelectorAll(".header-cell");
    const episodesList = document.querySelector(".episodes-list");
    
    let episodesData = [];
    let currentSortField = 'rank', currentSortOrder = 'asc';

    async function loadEpisodes() {
        const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
        const data = await response.json();
        episodesData = data.episodes;

        populateFilters();
        displayEpisodes();
    }

    function populateFilters() {
        const eras = new Set(episodesData.map(ep => ep.era));
        const doctors = new Set(episodesData.map(ep => ep.doctor.actor));
        const companions = new Set(episodesData.filter(ep => ep.companion).map(ep => ep.companion.actor));
        
        populateDropdown(eraFilter, eras);
        populateDropdown(doctorFilter, doctors);
        populateDropdown(companionFilter, companions);
    }

    function populateDropdown(dropdown, items) {
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            dropdown.appendChild(option);
        });
    }

    function displayEpisodes() {
        episodesList.innerHTML = episodesData
            .filter(filterEpisodes)
            .sort(sortEpisodes)
            .map(createEpisodeRow)
            .join('');
    }

    function filterEpisodes(episode) {
        const nameMatch = episode.title.toLowerCase().includes(nameFilter.value.toLowerCase());
        const eraMatch = !eraFilter.value || episode.era === eraFilter.value;
        const doctorMatch = !doctorFilter.value || episode.doctor.actor === doctorFilter.value;
        const companionMatch = !companionFilter.value || (episode.companion && episode.companion.actor === companionFilter.value);
        
        return nameMatch && eraMatch && doctorMatch && companionMatch;
    }

    function sortEpisodes(a, b) {
        const order = currentSortOrder === 'asc' ? 1 : -1;
        let fieldA = a[currentSortField];
        let fieldB = b[currentSortField];

        if (currentSortField === 'rank') {
            fieldA = parseInt(fieldA); fieldB = parseInt(fieldB);
        } else if (currentSortField === 'era') {
            const eraOrder = { 'Classic': 1, 'Modern': 2, 'Recent': 3 };
            fieldA = eraOrder[fieldA]; fieldB = eraOrder[fieldB];
        }

        return fieldA < fieldB ? -order : fieldA > fieldB ? order : 0;
    }

    function createEpisodeRow(episode) {
        const eraIcon = `<img src="images/${episode.era.toLowerCase()}.jpg" alt="${episode.era} era icon" class="era-icon">`;
        const doctorInfo = `${episode.doctor.actor} (${episode.doctor.incarnation})`;
        const companionInfo = episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : "N/A";
        const castCount = episode.cast.length;
        const castList = episode.cast.slice(0, 5).map(c => `${c.actor} (${c.character})`).join(', ');
        const plotPreview = episode.plot.length > 50 ? `${episode.plot.slice(0, 47)}...` : episode.plot;

        return `
            <div class="episode-row">
                <div class="episode-cell">${episode.rank}</div>
                <div class="episode-cell">${episode.title}</div>
                <div class="episode-cell">${episode.series}</div>
                <div class="episode-cell">${eraIcon}</div>
                <div class="episode-cell">${new Date(episode.broadcast_date).getFullYear()}</div>
                <div class="episode-cell">${episode.director}</div>
                <div class="episode-cell">${episode.writer}</div>
                <div class="episode-cell">${doctorInfo}</div>
                <div class="episode-cell">${companionInfo}</div>
                <div class="episode-cell">${castCount}</div>
                <div class="episode-cell">${plotPreview}</div>
            </div>
        `;
    }

    nameFilter.addEventListener("input", displayEpisodes);
    eraFilter.addEventListener("change", displayEpisodes);
    doctorFilter.addEventListener("change", displayEpisodes);
    companionFilter.addEventListener("change", displayEpisodes);
    
    headers.forEach(header => header.addEventListener("click", () => {
        currentSortField = header.dataset.sort;
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        
        headers.forEach(h => h.classList.remove("sorted-asc", "sorted-desc"));
        header.classList.add(currentSortOrder === 'asc' ? "sorted-asc" : "sorted-desc");
        
        displayEpisodes();
    }));

    loadEpisodes();
});
