"use strict";

interface Episodes {
    rank: number; // the numeric rank of an episode, unique for each episode
    title: string; // the title of the episode
    series: number; // the series number of the episode
    era: string; // the era of the episode, either "Classic", "Modern" or "Recent"
    broadcast_date: string; // the date the episode was first broadcast, in the format "YYYY-MM-DD"
    director: string; // the name of the director of the episode
    writer: string; // the name of the writer of the episode
    plot: string; // a brief description of the episode
    doctor: {
        actor: string; // the name of the actor who played the Doctor in the episode
        incarnation: string; // the incarnation of the Doctor in the episode
    };
    companion?: { // information about the companion in the episode (optional)
        actor: string; // the name of the actor who played the companion in the episode
        character: string; // the name of the companion character in the episode
    };
    cast: { // an array of objects, each containing information about a cast member
        actor: string; // the name of the actor
        character: string; // the name of the character
    }[];
}

type EpisodesSorter = (first: Episodes, second: Episodes) => number;

document.addEventListener("DOMContentLoaded", siteCode);

let episodes: Episodes[] = [];

async function siteCode() {
    const data = await loadData();
    episodes = data;

    displayEpisodes(episodes);

    const titleSort = document.getElementById("sort-title")!;
    titleSort.addEventListener("click", sortByTitle);

    const idSort = document.getElementById("sort-id")!;
    idSort.addEventListener("click", sortById);

    const applyFilterButton = document.getElementById("apply-filter")!;
    applyFilterButton.addEventListener("click", applyFilter);

    const modal = document.getElementById("biblio-details")!;
    modal.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

const titleSorter: EpisodesSorter = (first, second) => first.title.localeCompare(second.title);
const idSorter: EpisodesSorter = (first, second) => first.rank - second.rank;

const sortByTitle = () => {
    const sortedEpisodes = [...episodes].sort(titleSorter);
    displayEpisodes(sortedEpisodes);
}

const sortById = () => {
    const sortedEpisodes = [...episodes].sort(idSorter);
    displayEpisodes(sortedEpisodes);
}

const applyFilter = () => {
    const titleElement = document.getElementById("title-filter") as HTMLSelectElement;
    const title = titleElement.value;

    const directorElement = document.getElementById("director-filter") as HTMLSelectElement;
    const director = directorElement.value;

    let filteredEpisodes = episodes;
    if (title !== "all") {
        filteredEpisodes = filteredEpisodes.filter(episode => episode.title === title);
    }
    if (director !== "all") {
        filteredEpisodes = filteredEpisodes.filter(episode => episode.director === director);
    }
    displayEpisodes(filteredEpisodes);
}

async function loadData() {
    const dataUri = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
    try {
        const response = await fetch(dataUri);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.episodes;
    } catch (error) {
        console.error("Failed to load data:", error);
        alert("Failed to load data. Please check the console for more details.");
    }
}

function displayEpisodes(episodes: Episodes[]) {
    const container = document.getElementById("episodes-container")!;
    container.innerHTML = "";

    for (const episode of episodes) {
        const episodeTable = generateEpisodesTable(episode);
        container.appendChild(episodeTable);
    }
}

function generateEpisodesTable(episode: Episodes) {
    const table = document.createElement("div");
    table.classList.add("episodes-table");

    const episodesData = [
        episode.rank,
        episode.title,
        episode.director,
        episode.broadcast_date,
        episode.plot,
        //generateCastList(episode.cast),
    ];

    for (const data of episodesData) {
        const episodeDataElement = document.createElement("div");
        episodeDataElement.classList.add("episodes-data");
        episodeDataElement.innerHTML = data.toString();
        table.appendChild(episodeDataElement);
    }

    return table;
}

function generateCastList(cast: { actor: string; character: string }[]) {
    const ul = document.createElement("ul");

    for (const member of cast) {
        const li = document.createElement("li");
    }
}