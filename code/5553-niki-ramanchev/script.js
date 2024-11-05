document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
    const episodesContainer = document.querySelector(".episodes-list");
    const titleFilter = document.getElementById("name-filter");
    const eraFilterSelect = document.getElementById("era-filter");
    const doctorFilterSelect = document.getElementById("doctor-filter");
    let episodesData = [];
    let sortSettings = { key: "rank", direction: "asc" };

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data?.episodes) {
            episodesData = data.episodes;
            initializeFilters();
            displayEpisodes();
        } else {
            console.error("Data error: 'episodes' property not found.");
        }
    } catch (error) {
        console.error("Failed to load data:", error);
    }

    function initializeFilters() {
        const eras = new Set();
        const doctors = new Set();

        episodesData.forEach((ep) => {
            eras.add(ep.era);
            doctors.add(ep.doctor.actor);
        });

        populateDropdown(eraFilterSelect, Array.from(eras));
        populateDropdown(doctorFilterSelect, Array.from(doctors));
    }

    function populateDropdown(selectElement, options) {
        options.forEach((option) => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    function displayEpisodes() {
        const filteredEpisodes = episodesData
            .filter((ep) => episodeMatchesFilters(ep))
            .sort(sortEpisodes);

        episodesContainer.querySelectorAll(".episode-row").forEach((row) => row.remove());

        filteredEpisodes.forEach((episode) => {
            const episodeDiv = document.createElement("div");
            episodeDiv.className = "episode-row";
            episodeDiv.innerHTML = createEpisodeHTML(episode);
            episodesContainer.appendChild(episodeDiv);
        });
    }

    function episodeMatchesFilters(episode) {
        const titleMatch = episode.title.toLowerCase().includes(titleFilter.value.toLowerCase());
        const eraMatch = !eraFilterSelect.value || episode.era === eraFilterSelect.value;
        const doctorMatch = !doctorFilterSelect.value || episode.doctor.actor === doctorFilterSelect.value;
        return titleMatch && eraMatch && doctorMatch;
    }

    function sortEpisodes(a, b) {
        const { key, direction } = sortSettings;
        const sortOrder = direction === "asc" ? 1 : -1;

        if (key === "era") {
            const eraPriority = { "Classic": 0, "Modern": 1, "Recent": 2 };
            return (eraPriority[a.era] - eraPriority[b.era]) * sortOrder;
        }
        if (key === "rank" || key === "series") {
            return (a[key] - b[key]) * sortOrder;
        }
        if (key === "doctor") {
            return a.doctor.actor.localeCompare(b.doctor.actor) * sortOrder;
        }

        return a[key].localeCompare(b[key]) * sortOrder;
    }

    function createEpisodeHTML(episode) {
        const broadcastYear = new Date(episode.broadcast_date).getFullYear();
        const broadcastDecade = `${Math.floor(broadcastYear / 10) * 10}s`;
        const episodePlot = shortenText(episode.plot, 50);
        const doctorInfo = `${episode.doctor.actor} (${episode.doctor.incarnation})`;
        const castCount = episode.cast.length;
    
        return `
            <div class="episode-cell">${episode.rank}</div>
            <div class="episode-cell">${episode.title}</div>
            <div class="episode-cell">${episode.series}</div>
            <div class="episode-cell">${episode.era}</div>
            <div class="episode-cell">${broadcastYear}</div>
            <div class="episode-cell">${broadcastDecade}</div>
            <div class="episode-cell">${episode.director}</div>
            <div class="episode-cell">${episode.writer}</div>
            <div class="episode-cell">${doctorInfo}</div>
            <div class="episode-cell">${castCount}</div>
            <div class="episode-cell plot-preview">${episodePlot}</div>
        `;
    }
    
    function shortenText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, text.lastIndexOf(" ", maxLength)) + "…";
    }

    document.querySelectorAll(".header-cell").forEach((header) => {
        header.addEventListener("click", () => {
            const field = header.dataset.sort;
            if (sortSettings.key === field) {
                sortSettings.direction = sortSettings.direction === "asc" ? "desc" : "asc";
            } else {
                sortSettings.key = field;
                sortSettings.direction = "asc";
            }
            displayEpisodes();
        });
    });

    [titleFilter, eraFilterSelect, doctorFilterSelect].forEach((input) => {
        input.addEventListener("input", displayEpisodes);
    });
});
