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
document.addEventListener("DOMContentLoaded", siteCode);
var episodes = [];
var rankSortAscending = true;
var titleSortAscending = true;
var seriesSortAscending = true;
var eraSortAscending = true;
var broadcastDateSortAscending = true;
var directorSortAscending = true;
var writerSortAscending = true;
var plotSortAscending = true;
var doctorSortAscending = true;
var companionSortAscending = true;
var castSortAscending = true;
function siteCode() {
    return __awaiter(this, void 0, void 0, function () {
        var data, rankSort, titleSort, seriesSort, eraSort, broadcastDateSort, directorSort, writerSort, plotSort, doctorSort, companionSort, castSort, applyFilterButton, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, loadData()];
                case 1:
                    data = _a.sent();
                    episodes = data.episodes;
                    displayEpisodes(episodes);
                    fillEras(episodes);
                    rankSort = document.getElementById("rank-sort");
                    rankSort.addEventListener("click", sortByRank);
                    titleSort = document.getElementById("title-sort");
                    titleSort.addEventListener("click", sortByTitle);
                    seriesSort = document.getElementById("series-sort");
                    seriesSort.addEventListener("click", sortBySeries);
                    eraSort = document.getElementById("era-sort");
                    eraSort.addEventListener("click", sortByEra);
                    broadcastDateSort = document.getElementById("broadcast-sort");
                    broadcastDateSort.addEventListener("click", sortByBroadcast);
                    directorSort = document.getElementById("director-sort");
                    directorSort.addEventListener("click", sortByDirector);
                    writerSort = document.getElementById("writer-sort");
                    writerSort.addEventListener("click", sortByWriter);
                    plotSort = document.getElementById("plot-sort");
                    plotSort.addEventListener("click", sortByPlot);
                    doctorSort = document.getElementById("doctor-sort");
                    doctorSort.addEventListener("click", sortByDoctor);
                    companionSort = document.getElementById("companion-sort");
                    companionSort.addEventListener("click", sortByCompanion);
                    castSort = document.getElementById("cast-sort");
                    castSort.addEventListener("click", sortByCast);
                    applyFilterButton = document.getElementById("apply-filter");
                    applyFilterButton.addEventListener("click", applyFilter);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log("Error", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var sortByRank = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return rankSortAscending ? a.rank - b.rank : b.rank - a.rank;
    });
    displayEpisodes(sortedEpisodes);
    rankSortAscending = !rankSortAscending;
    var rankSort = document.getElementById("rank-sort");
    rankSort.innerText = rankSortAscending ? "Rank ▲" : "Rank ▼";
};
var sortByTitle = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return titleSortAscending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
    displayEpisodes(sortedEpisodes);
    titleSortAscending = !titleSortAscending;
    var titleSort = document.getElementById("title-sort");
    titleSort.innerText = titleSortAscending ? "Title ▲" : "Title ▼";
};
var sortBySeries = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return seriesSortAscending ? a.series - b.series : b.series - a.series;
    });
    displayEpisodes(sortedEpisodes);
    seriesSortAscending = !seriesSortAscending;
    var seriesSort = document.getElementById("series-sort");
    seriesSort.innerText = seriesSortAscending ? "Series ▲" : "Series ▼";
};
var sortByEra = function () {
    var eraOrder = { "Classic": 1, "Modern": 2, "Recent": 3 };
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        var eraA = eraOrder[a.era] !== undefined ? eraOrder[a.era] : 0; // Default to 0 for unrecognized eras
        var eraB = eraOrder[b.era] !== undefined ? eraOrder[b.era] : 0; // Default to 0 for unrecognized eras
        return eraSortAscending ? eraA - eraB : eraB - eraA;
    });
    displayEpisodes(sortedEpisodes);
    eraSortAscending = !eraSortAscending;
    var eraSort = document.getElementById("era-sort");
    eraSort.innerText = eraSortAscending ? "Era ▲" : "Era ▼";
};
var sortByBroadcast = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return broadcastDateSortAscending
            ? new Date(a.broadcast_date).getTime() - new Date(b.broadcast_date).getTime()
            : new Date(b.broadcast_date).getTime() - new Date(a.broadcast_date).getTime();
    });
    displayEpisodes(sortedEpisodes);
    broadcastDateSortAscending = !broadcastDateSortAscending;
    var broadcastSort = document.getElementById("broadcast-sort");
    broadcastSort.innerText = broadcastDateSortAscending ? "Broadcast ▲" : "Broadcast ▼";
};
var sortByDirector = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return directorSortAscending ? a.director.localeCompare(b.director) : b.director.localeCompare(a.director);
    });
    displayEpisodes(sortedEpisodes);
    directorSortAscending = !directorSortAscending;
    var directorSort = document.getElementById("director-sort");
    directorSort.innerText = directorSortAscending ? "Director ▲" : "Director ▼";
};
var sortByWriter = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return writerSortAscending ? a.writer.localeCompare(b.writer) : b.writer.localeCompare(a.writer);
    });
    displayEpisodes(sortedEpisodes);
    writerSortAscending = !writerSortAscending;
    var writerSort = document.getElementById("writer-sort");
    writerSort.innerText = writerSortAscending ? "Writer ▲" : "Writer ▼";
};
var sortByPlot = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        return plotSortAscending ? a.plot.localeCompare(b.plot) : b.plot.localeCompare(a.plot);
    });
    displayEpisodes(sortedEpisodes);
    plotSortAscending = !plotSortAscending;
    var plotSort = document.getElementById("plot-sort");
    plotSort.innerText = plotSortAscending ? "Plot ▲" : "Plot ▼";
};
var sortByDoctor = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        var doctorA = a.doctor.length > 0 ? a.doctor[0].actor : "";
        var doctorB = b.doctor.length > 0 ? b.doctor[0].actor : "";
        return doctorSortAscending ? doctorA.localeCompare(doctorB) : doctorB.localeCompare(doctorA);
    });
    displayEpisodes(sortedEpisodes);
    doctorSortAscending = !doctorSortAscending;
    var doctorSort = document.getElementById("doctor-sort");
    doctorSort.innerText = doctorSortAscending ? "Doctor ▲" : "Doctor ▼";
};
var sortByCompanion = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        var companionA = a.companion.length > 0 ? a.companion[0].actor : "";
        var companionB = b.companion.length > 0 ? b.companion[0].actor : "";
        return companionSortAscending ? companionA.localeCompare(companionB) : companionB.localeCompare(companionA);
    });
    displayEpisodes(sortedEpisodes);
    companionSortAscending = !companionSortAscending;
    var companionSort = document.getElementById("companion-sort");
    companionSort.innerText = companionSortAscending ? "Companion ▲" : "Companion ▼";
};
var sortByCast = function () {
    var sortedEpisodes = episodes.slice().sort(function (a, b) {
        var castLengthDiff = a.cast.length - b.cast.length;
        if (castLengthDiff !== 0) {
            return castSortAscending ? castLengthDiff : -castLengthDiff;
        }
        var castA = a.cast.length > 0 ? a.cast[0].actor : "";
        var castB = b.cast.length > 0 ? b.cast[0].actor : "";
        return castSortAscending ? castA.localeCompare(castB) : castB.localeCompare(castA);
    });
    displayEpisodes(sortedEpisodes);
    castSortAscending = !castSortAscending;
    var castSort = document.getElementById("cast-sort");
    castSort.innerText = castSortAscending ? "Cast ▲" : "Cast ▼";
};
var fillEras = function (episodes) {
    var filter = document.getElementById("era-filter");
    filter.innerHTML = '<option value="all" selected>All</option>';
    var eras = Array.from(new Set(episodes.map(function (episodes) { return episodes.era; })));
    for (var _i = 0, eras_1 = eras; _i < eras_1.length; _i++) {
        var era = eras_1[_i];
        var option = document.createElement("option");
        option.value = era;
        option.innerHTML = era;
        filter.appendChild(option);
    }
};
var applyFilter = function () {
    var nameElement = document.getElementById("name-filter");
    var name = nameElement.value.toLowerCase().trim();
    var eraElement = document.getElementById("era-filter");
    var era = eraElement.value;
    var filteredEpisodes = episodes;
    if (name !== "") {
        filteredEpisodes = filteredEpisodes.filter(function (episode) { return episode.title.toLowerCase().includes(name.toLowerCase()); });
    }
    if (era !== "all") {
        filteredEpisodes = filteredEpisodes.filter(function (episode) { return episode.era.toLowerCase() === era.toLowerCase(); });
    }
    displayEpisodes(filteredEpisodes);
};
var loadData = function () { return __awaiter(_this, void 0, void 0, function () {
    var dataUri, response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dataUri = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
                return [4 /*yield*/, fetch(dataUri)];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("The data is not there");
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
var displayEpisodes = function (episodes) {
    var container = document.getElementById("episode-container");
    container.innerHTML = "";
    for (var _i = 0, episodes_1 = episodes; _i < episodes_1.length; _i++) {
        var episode = episodes_1[_i];
        var episodeRow = generateEpisodeRow(episode);
        container.appendChild(episodeRow);
    }
};
var generateEpisodeRow = function (episode) {
    var row = document.createElement("div");
    row.classList.add("episode-row");
    var rankCell = document.createElement("div");
    rankCell.classList.add("episode-data", "episode-rank");
    rankCell.innerHTML = episode.rank.toString();
    row.appendChild(rankCell);
    var titleCell = document.createElement("div");
    titleCell.classList.add("episode-data", "episode-name");
    titleCell.innerHTML = episode.title;
    row.appendChild(titleCell);
    var seriesCell = document.createElement("div");
    seriesCell.classList.add("episode-data", "episode-series");
    seriesCell.innerHTML = episode.series.toString();
    row.appendChild(seriesCell);
    var eraCell = document.createElement("div");
    eraCell.classList.add("episode-data", "episode-era");
    eraCell.innerHTML = episode.era;
    row.appendChild(eraCell);
    // Bonus Era Icon Section
    var eraIconCell = document.createElement("div");
    eraIconCell.classList.add("episode-data", "episode-era-icon");
    var eraIcon = document.createElement("img");
    eraIcon.alt = "".concat(episode.era, " Era Icon");
    eraIcon.style.width = "20px";
    eraIcon.style.height = "20px";
    switch (episode.era) {
        case "Classic":
            eraIcon.src = "images/classic.jpg";
            break;
        case "Modern":
            eraIcon.src = "images/modern.jpg";
            break;
        case "Recent":
            eraIcon.src = "images/recent.jpg";
            break;
        default:
            eraIcon.src = "images/default.jpg"; // Optional default icon
    }
    eraIconCell.appendChild(eraIcon);
    row.appendChild(eraIconCell); // 
    var broadcastDateCell = document.createElement("div");
    broadcastDateCell.classList.add("episode-data", "episode-broadcastDate");
    broadcastDateCell.innerHTML = episode.broadcast_date;
    row.appendChild(broadcastDateCell);
    var directorCell = document.createElement("div");
    directorCell.classList.add("episode-data", "episode-director");
    directorCell.innerHTML = episode.director;
    row.appendChild(directorCell);
    var writerCell = document.createElement("div");
    writerCell.classList.add("episode-data", "episode-writer");
    writerCell.innerHTML = episode.writer;
    row.appendChild(writerCell);
    var doctorCell = document.createElement("div");
    doctorCell.classList.add("episode-data", "episode-doctor");
    if (Array.isArray(episode.doctor)) {
        doctorCell.innerHTML = episode.doctor.map(function (doctor) {
            return "".concat(doctor.actor, " as the ").concat(doctor.incarnation);
        }).join(", ");
    }
    else {
        doctorCell.innerHTML = "No doctors available";
    }
    row.appendChild(doctorCell);
    var companionCell = document.createElement("div");
    companionCell.classList.add("episode-data", "episode-companion");
    if (Array.isArray(episode.companion) && episode.companion.length > 0) {
        companionCell.innerHTML = episode.companion.map(function (companion) {
            return "".concat(companion.actor, " as ").concat(companion.character);
        }).join(", ");
    }
    else {
        companionCell.innerHTML = "No companions available";
    }
    row.appendChild(companionCell);
    var castCell = document.createElement("div");
    castCell.classList.add("episode-data", "episode-cast");
    castCell.innerHTML = episode.cast.map(function (castMember) {
        return "".concat(castMember.actor, " as ").concat(castMember.character);
    }).join(", ");
    row.appendChild(castCell);
    var plotCell = document.createElement("div");
    plotCell.classList.add("episode-data", "episode-plot");
    plotCell.innerHTML = episode.plot;
    row.appendChild(plotCell);
    return row;
};
