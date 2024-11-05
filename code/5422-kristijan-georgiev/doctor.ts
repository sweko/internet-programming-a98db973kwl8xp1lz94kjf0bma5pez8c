interface Cast {
    actor: string;
    character: string;
}
interface Episode {
    rank: number;
    title: string;
    series: number;
    era: string;
    broadcast_date: string;
    director: string;
    writer: string;
    plot: string;
    cast: Cast[];
}
type EpisodeSorter = (first: Episode, second: Episode) => number;

document.addEventListener("DOMContentLoaded", setupInfrastructure);

let episodes: Episode[] = [];

async function setupInfrastructure() {
    const data = await loadData();
    episodes = data;
    const nameSorter = document.getElementById("sort-name");
    nameSorter?.addEventListener("click", SortByName);

    const idSort = document.getElementById("sort-id");
    idSort?.addEventListener("click", SortById);


    const modal = document.getElementById("cast-details");
    modal?.addEventListener("click", () => {
        modal?.classList.add("hidden");
    });
    displayEpisodes(episodes);
}

const titleSorterFunction: EpisodeSorter = (first, second) => first.title.localeCompare(second.title);
const rankSorterFunction: EpisodeSorter = (first, second) => first.rank - second.rank;

const SortByName = () => {
    const sortedEpisodes = episodes.sort(titleSorterFunction);
    displayEpisodes(sortedEpisodes);
}

const SortById = () => {
    const sortedEpisodes = episodes.sort(rankSorterFunction);
    displayEpisodes(sortedEpisodes);
}

const loadData = async (): Promise<Episode[]> => {
    const dataUri = "https://raw.githubusercontent.com/kristijanGeorgiev/InternetProgramming/refs/heads/main/data/doctor-who-episodes.json"
    const response = await fetch(dataUri);

    if (!response.ok) {
        throw new Error("The data is not there");
    }

    const data: { episodes: Episode[] } = await response.json();
    return data.episodes;
}

const displayEpisodes = (episode: Episode[]) => {
    const container = document.getElementById("episode-container");
    if (!container) return;

    container.innerHTML = "";

    for (const episode of episodes) {
        const episodeRow = generateEpisodeRow(episode);
        container.appendChild(episodeRow);
    }
}

const generateEpisodeRow = (episode: Episode) => {
    const row = document.createElement("div");
    row.classList.add("episode-row");

    const rankCell = document.createElement("div");
    rankCell.classList.add("episode-data", "episode-rank");
    rankCell.innerHTML = episode.rank.toString();
    row.appendChild(rankCell);

    const titleCell = document.createElement("div");
    titleCell.classList.add("episode-data", "episode-title");
    titleCell.innerHTML = episode.title;
    row.appendChild(titleCell);

    const seriesCell = document.createElement("div");
    seriesCell.classList.add("episode-data", "episode-series");
    seriesCell.innerHTML = episode.series.toString();
    row.appendChild(seriesCell);

    const eraCell = document.createElement("div");
    eraCell.classList.add("episode-data", "episode-era");
    eraCell.innerHTML = episode.era;
    row.appendChild(eraCell);

    const broadcast_dateCell = document.createElement("div");
    broadcast_dateCell.classList.add("episode-data", "episode-broadcast_date");
    broadcast_dateCell.innerHTML = episode.broadcast_date;
    row.appendChild(broadcast_dateCell);

    const directorCell = document.createElement("div");
    directorCell.classList.add("episode-data", "episode-director");
    directorCell.innerHTML = episode.director;
    row.appendChild(directorCell);

    const writerCell = document.createElement("div");
    writerCell.classList.add("episode-data", "episode-writer");
    writerCell.innerHTML = episode.writer;
    row.appendChild(writerCell);

    const plotCell = document.createElement("div");
    plotCell.classList.add("episode-data", "episode-plot");
    plotCell.innerHTML = episode.plot;
    row.appendChild(plotCell);

    const castCell = document.createElement("div");
    castCell.classList.add("episode-data", "episode-cast");
    castCell.addEventListener("click", () => {
        const modal = document.getElementById("cast-details")!;
        modal.classList.remove("hidden");

        const modalHeader = document.querySelector("#cast-details-content h2")! as HTMLHeadingElement;
        modalHeader.innerText = `Selected cast for ${episode.title}`;

        const castList = document.getElementById("cast-details-list")! as HTMLUListElement;
        castList.innerHTML = "";
        for (const cast of episode.cast) {
            const castItem = document.createElement("li");
            castItem.innerText = `${cast.actor} (${cast.character}))`;
            castList.appendChild(castItem);
        }
    })
    row.appendChild(castCell);
    return row;
}