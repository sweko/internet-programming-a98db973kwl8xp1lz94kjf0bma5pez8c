let episodes = [];
let currentSort = { field: "rank", order: "asc" };

async function loadEpisodes() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
        const data = await response.json();
        episodes = data.episodes;
        setupFilters();
        renderEpisodes();
    } catch (error) {
        console.error("Error loading episodes:", error);
    }
}

function setupFilters() {
    populateFilter("era-filter", [...new Set(episodes.map(e => e.era))]);
    populateFilter("doctor-filter", [...new Set(episodes.map(e => e.doctor.actor))]);
    populateFilter("companion-filter", [...new Set(episodes.filter(e => e.companion).map(e => e.companion.actor))]);
}

function populateFilter(id, options) {
    const filter = document.getElementById(id);
    options.forEach(opt => filter.add(new Option(opt, opt)));
}

function renderEpisodes() {
    const container = document.querySelector(".episodes-list");
    container.innerHTML = `<div class="episodes-header">${getHeaders()}</div>`;
    const filteredEpisodes = applyFilters();
    const sortedEpisodes = applySort(filteredEpisodes);
    sortedEpisodes.forEach(ep => container.append(createEpisodeRow(ep)));
}

function getHeaders() {
    const headers = ["Rank", "Name", "Series", "Era", "Broadcast Year", "Director", "Writer", "Doctor", "Companion", "Cast", "Plot"];
    return headers.map(header => `<div class="header-cell" data-sort="${header.toLowerCase()}" onclick="changeSort('${header.toLowerCase()}')">${header}</div>`).join("");
}

function createEpisodeRow(episode) {
    const row = document.createElement("div");
    row.classList.add("episode-row");
    row.innerHTML = `
        <div class="episode-cell">${episode.rank}</div>
        <div class="episode-cell">${episode.title}</div>
        <div class="episode-cell">${episode.series}</div>
        <div class="episode-cell"><img class="era-icon" src="images/${episode.era.toLowerCase()}.jpg"> ${episode.era}</div>
        <div class="episode-cell">${new Date(episode.broadcast_date).getFullYear()}</div>
        <div class="episode-cell">${episode.director}</div>
        <div class="episode-cell">${episode.writer}</div>
        <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
        <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : ""}</div>
        <div class="episode-cell">${episode.cast.length}</div>
        <div class="episode-cell plot-preview">${shortenText(episode.plot, 50)}</div>
    `;
    return row;
}

function shortenText(text, length) {
    return text.length <= length ? text : text.slice(0, text.lastIndexOf(" ", length)) + "...";
}

function changeSort(field) {
    currentSort.order = currentSort.field === field && currentSort.order === "asc" ? "desc" : "asc";
    currentSort.field = field;
    renderEpisodes();
}

function applySort(episodes) {
    const { field, order } = currentSort;
    return [...episodes].sort((a, b) => {
        const valA = getFieldValue(a, field);
        const valB = getFieldValue(b, field);
        return (valA > valB ? 1 : -1) * (order === "asc" ? 1 : -1);
    });
}

function getFieldValue(episode, field) {
    switch (field) {
        case "rank": return episode.rank;
        case "broadcast": return new Date(episode.broadcast_date);
        case "doctor": return episode.doctor.actor;
        case "companion": return episode.companion ? episode.companion.actor : "";
        case "cast": return episode.cast.length;
        default: return episode[field] || "";
    }
}

function applyFilters() {
    const name = document.getElementById("name-filter").value.toLowerCase();
    const era = document.getElementById("era-filter").value;
    const doctor = document.getElementById("doctor-filter").value;
    const companion = document.getElementById("companion-filter").value;

    return episodes.filter(ep => 
        ep.title.toLowerCase().includes(name) &&
        (!era || ep.era === era) &&
        (!doctor || ep.doctor.actor === doctor) &&
        (!companion || (ep.companion && ep.companion.actor === companion))
    );
}

document.getElementById("name-filter").addEventListener("input", renderEpisodes);
document.getElementById("era-filter").addEventListener("change", renderEpisodes);
document.getElementById("doctor-filter").addEventListener("change", renderEpisodes);
document.getElementById("companion-filter").addEventListener("change", renderEpisodes);

loadEpisodes();
