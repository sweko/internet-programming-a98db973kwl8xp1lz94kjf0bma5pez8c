"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let episodes = [];
let sortField = "rank";
let sortDirection = "asc";
// I couldn't get it to work without this Promise<void> thing
const fetchEpisodes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
        const data = yield response.json();
        episodes = data.episodes;
        populateFilters(episodes);
        renderEpisodes(episodes);
    }
    catch (error) {
        console.error("Error fetching episodes:", error);
    }
});
fetchEpisodes();
const renderEpisodes = (episodesList) => {
    const container = document.getElementById("data-container");
    container.innerHTML = "";
    episodesList.forEach((episode) => {
        const broadcastYear = new Date(episode.broadcast_date).getFullYear();
        const doctorInfo = `${episode.doctor.actor} (${episode.doctor.incarnation})`;
        const companionInfo = episode.companion
            ? `${episode.companion.actor} (${episode.companion.character})`
            : "N/A";
        const castCount = episode.cast.length;
        const row = document.createElement("div");
        row.classList.add("episode-row");
        row.innerHTML = `
      <div class="episode-cell">${episode.rank}</div>
      <div class="episode-cell">${episode.title}</div>
      <div class="episode-cell">${episode.series}</div>
      <div class="episode-cell">${episode.era}</div>
      <div class="episode-cell">${broadcastYear}</div>
      <div class="episode-cell">${episode.director}</div>
      <div class="episode-cell">${episode.writer}</div>
      <div class="episode-cell">${doctorInfo}</div>
      <div class="episode-cell">${companionInfo}</div>
      <div class="episode-cell">${castCount}</div>
      <div class="episode-cell plot-preview">${episode.plot}</div>
    `;
        container.appendChild(row);
    });
};
const sortEpisodes = (episodesList) => {
    return episodesList.sort((a, b) => {
        var _a, _b;
        let aValue;
        let bValue;
        switch (sortField) {
            case "rank":
            case "title":
            case "series":
            case "director":
            case "writer":
                aValue = a[sortField];
                bValue = b[sortField];
                break;
            case "broadcast_year":
                aValue = new Date(a.broadcast_date).getFullYear();
                bValue = new Date(b.broadcast_date).getFullYear();
                break;
            case "broadcast_decade":
                aValue = Math.floor(new Date(a.broadcast_date).getFullYear() / 10);
                bValue = Math.floor(new Date(b.broadcast_date).getFullYear() / 10);
                break;
            case "era":
                const eraOrder = { Classic: 1, Modern: 2, Recent: 3 };
                aValue = eraOrder[a.era];
                bValue = eraOrder[b.era];
                break;
            case "doctor":
                aValue = a.doctor.actor;
                bValue = b.doctor.actor;
                break;
            case "companion":
                aValue = a.companion ? a.companion.actor : "";
                bValue = b.companion ? b.companion.actor : "";
                break;
            case "cast":
                aValue = [a.cast.length, (_a = a.cast[0]) === null || _a === void 0 ? void 0 : _a.actor];
                bValue = [b.cast.length, (_b = b.cast[0]) === null || _b === void 0 ? void 0 : _b.actor];
                break;
            default:
                return 0;
        }
        if (aValue < bValue)
            return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue)
            return sortDirection === "asc" ? 1 : -1;
        return 0;
    });
};
const updateSort = (field) => {
    if (sortField === field) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
    }
    else {
        sortField = field;
        sortDirection = "asc";
    }
    renderEpisodes(sortEpisodes(episodes));
};
document.querySelectorAll(".header-cell").forEach((header) => {
    header.addEventListener("click", () => {
        const field = header.dataset.sort;
        updateSort(field);
    });
});
const filterEpisodes = () => {
    const nameFilter = document.getElementById("name-filter").value.toLowerCase();
    const eraFilter = document.getElementById("era-filter")
        .value;
    return episodes.filter((episode) => {
        const matchesName = episode.title.toLowerCase().includes(nameFilter);
        const matchesEra = !eraFilter || episode.era === eraFilter;
        return matchesName && matchesEra;
    });
};
const updateFilteredEpisodes = () => {
    const filteredEpisodes = filterEpisodes();
    renderEpisodes(sortEpisodes(filteredEpisodes));
};
const populateFilters = (episodesList) => {
    const eraSet = new Set(episodesList.map((episode) => episode.era));
    const eraFilter = document.getElementById("era-filter");
    eraSet.forEach((era) => {
        const option = document.createElement("option");
        option.value = era;
        option.textContent = era;
        eraFilter.appendChild(option);
    });
};
document
    .getElementById("name-filter")
    .addEventListener("input", updateFilteredEpisodes);
document
    .getElementById("era-filter")
    .addEventListener("change", updateFilteredEpisodes);
