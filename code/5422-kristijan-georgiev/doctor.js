var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener("DOMContentLoaded", setupInfrastructure);

let episodes = [];

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

const nameSorterFunction = (first, second) => first.title.localeCompare(second.title);
const idSorterFunction = (first, second) => first.rank - second.rank;

const SortByName = () => {
    const sortedEpisodes = episodes.sort(nameSorterFunction);
    displayEpisodes(sortedEpisodes);
}

const SortById = () => {
    const sortedEpisodes = episodes.sort(idSorterFunction);
    displayEpisodes(sortedEpisodes);
}

const loadData = async () => {
    const dataUri = "https://raw.githubusercontent.com/kristijanGeorgiev/InternetProgramming/refs/heads/main/data/doctor-who-episodes.json";
    const response = await fetch(dataUri);

    if (!response.ok) {
        throw new Error("The data is not there");
    }

    const data = await response.json();
    return data;
}

const displayEpisodes = (episodes) => {
    const container = document.getElementById("episode-container");
    if (!container) return;

    container.innerHTML = "";

    for (const episode of episodes) {
        const episodeRow = generateEpisodeRow(episode);
        container.appendChild(episodeRow);
    }
}

const generateEpisodeRow = (episode) => {
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
        const modal = document.getElementById("cast-details");
        modal.classList.remove("hidden");

        const modalHeader = document.querySelector("#cast-details-content h2");
        modalHeader.innerText = `Selected cast for ${episode.title}`;

        const castList = document.getElementById("cast-details-list");
        castList.innerHTML = "";
        for (const cast of episode.cast) {
            const castItem = document.createElement("li");
            castItem.innerText = `${cast.actor} (${cast.character})`;
            castList.appendChild(castItem);
        }
    });
    row.appendChild(castCell);
    return row;
}