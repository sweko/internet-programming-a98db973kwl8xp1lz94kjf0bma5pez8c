document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
    let episodes = [];
    let filteredEpisodes = [];
    let sortOrder = { column: 'rank', ascending: true };

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            episodes = data.episodes;
            populateDropdowns();
            displayEpisodes(episodes);
        });

    function displayEpisodes(episodes) {
        const rowsContainer = document.getElementById("episode-rows");
        rowsContainer.innerHTML = episodes.map(episode => `
            <div class="episode-row">
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
                <div class="episode-cell">${truncatePlot(episode.plot)}</div>
            </div>
        `).join("");
    }


    function populateDropdowns() {
        const doctorFilter = document.getElementById("doctor-filter");
        const companionFilter = document.getElementById("companion-filter");
        
        let doctors = [...new Set(episodes.map(ep => ep.doctor.actor))];
        let companions = [...new Set(episodes.map(ep => ep.companion?.actor).filter(Boolean))];

        doctors.forEach(doc => doctorFilter.innerHTML += `<option value="${doc}">${doc}</option>`);
        companions.forEach(comp => companionFilter.innerHTML += `<option value="${comp}">${comp}</option>`);
    }


    document.getElementById("name-filter").addEventListener("input", filterEpisodes);
    document.getElementById("era-filter").addEventListener("change", filterEpisodes);
    document.getElementById("doctor-filter").addEventListener("change", filterEpisodes);
    document.getElementById("companion-filter").addEventListener("change", filterEpisodes);

    function filterEpisodes() {
        const name = document.getElementById("name-filter").value.toLowerCase();
        const era = document.getElementById("era-filter").value;
        const doctor = document.getElementById("doctor-filter").value;
        const companion = document.getElementById("companion-filter").value;

        filteredEpisodes = episodes.filter(ep =>
            (!name || ep.title.toLowerCase().includes(name)) &&
            (!era || ep.era === era) &&
            (!doctor || ep.doctor.actor === doctor) &&
            (!companion || ep.companion?.actor === companion)
        );

        displayEpisodes(filteredEpisodes);
    }


    function truncatePlot(plot) {
        return plot.length > 50 ? plot.slice(0, 47) + "..." : plot;
    }
});
