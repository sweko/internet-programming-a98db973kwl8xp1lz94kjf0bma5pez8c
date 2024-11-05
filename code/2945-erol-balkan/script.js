"use strict";

document.addEventListener("DOMContentLoaded", siteCode);

let episodes = [];

async function siteCode() {
    const data = await loadData();
    episodes = data;
    displayEpisodes(episodes);

    const titleSort = document.getElementById("sort-title");
    if (titleSort) {
        titleSort.addEventListener("click", sortByTitle);
    }

    const idSort = document.getElementById("sort-id");
    if (idSort) {
        idSort.addEventListener("click", sortById);
    }

    const applyFilterButton = document.getElementById("apply-filter");
    if (applyFilterButton) {
        applyFilterButton.addEventListener("click", applyFilter);
    }

    const modal = document.getElementById("biblio-details");
    if (modal) {
        modal.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }
}

const titleSorter = (first, second) => first.title.localeCompare(second.title);
const idSorter = (first, second) => first.rank - second.rank; // Assuming rank is the correct property

const sortByTitle = () => {
    const sortedEpisodes = [...episodes].sort(titleSorter);
    displayEpisodes(sortedEpisodes);
};

const sortById = () => {
    const sortedEpisodes = [...episodes].sort(idSorter);
    displayEpisodes(sortedEpisodes);
};

const applyFilter = () => {
    const titleElement = document.getElementById("title-filter");
    const title = titleElement ? titleElement.value : "all";

    const directorElement = document.getElementById("director-filter");
    const director = directorElement ? directorElement.value : "all";

    let filteredEpisodes = episodes;

    if (title !== "all") {
        filteredEpisodes = filteredEpisodes.filter(episode => episode.title === title);
    }

    if (director !== "all") {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            if (director === "yes") {
                return episode.director === undefined;
            }
            return !!episode.director;
        });
    }

    displayEpisodes(filteredEpisodes);
};

async function loadData() {
    const dataUri = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
    try {
        const response = await fetch(dataUri);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load data:", error);
        alert("Failed to load data. Please check the console for more details.");
    }
}