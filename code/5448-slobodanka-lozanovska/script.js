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
var data = [];
var currentSort = "rank";
var displayEpisodes = function (episodes) {
    var container = document.getElementById("episode-container");
    if (container) {
        container.innerHTML = "";
        for (var _i = 0, episodes_1 = episodes; _i < episodes_1.length; _i++) {
            var episode = episodes_1[_i];
            displayEpisode(episode);
        }
    }
    else {
        console.error("Episodes list container not found");
    }
};
var displayEpisode = function (episode) {
    var container = document.getElementById("episode-container");
    if (container) {
        var row = document.createElement("div");
        row.classList.add("episode-row");
        row.appendChild(makeEpisodeDataDiv(episode.rank.toString()));
        row.appendChild(makeEpisodeDataDiv(episode.title));
        row.appendChild(makeEpisodeDataDiv(episode.series.toString()));
        row.appendChild(makeEpisodeDataDiv(episode.era));
        row.appendChild(makeEpisodeDataDiv(new Date(episode.broadcast_date).getFullYear().toString()));
        row.appendChild(makeEpisodeDataDiv(episode.director));
        row.appendChild(makeEpisodeDataDiv(episode.writer));
        row.appendChild(makeEpisodeDataDiv(episode.doctor.actor + " (" + episode.doctor.incarnation + ")"));
        row.appendChild(makeEpisodeDataDiv(episode.companion.actor + " (" + episode.companion.character + ")"));
        row.appendChild(makeEpisodeDataDiv(episode.cast.length.toString()));
        row.appendChild(makeEpisodeDataDiv(truncatePlot(episode.plot)));
        container.appendChild(row);
    }
    else {
        console.error("Episodes list container not found");
    }
};
var makeEpisodeDataDiv = function (data) {
    var div = document.createElement("div");
    div.classList.add("episode-cell");
    div.textContent = data;
    return div;
};
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    var localData, rankSort, nameSort, seriesSort, eraSort, broadcastSort, directorSort, writerSort, searchButton;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, loadData()];
            case 1:
                localData = _a.sent();
                data.push.apply(data, localData);
                displayEpisodes(data);
                rankSort = document.getElementById("sort-id");
                rankSort === null || rankSort === void 0 ? void 0 : rankSort.addEventListener("click", sortByRank);
                nameSort = document.getElementById("sort-name");
                nameSort === null || nameSort === void 0 ? void 0 : nameSort.addEventListener("click", sortByName);
                seriesSort = document.getElementById("sort-series");
                seriesSort === null || seriesSort === void 0 ? void 0 : seriesSort.addEventListener("click", sortBySeries);
                eraSort = document.getElementById("sort-era");
                eraSort === null || eraSort === void 0 ? void 0 : eraSort.addEventListener("click", sortByEra);
                broadcastSort = document.getElementById("sort-broadcast");
                broadcastSort === null || broadcastSort === void 0 ? void 0 : broadcastSort.addEventListener("click", sortByBroadcast);
                directorSort = document.getElementById("sort-director");
                directorSort === null || directorSort === void 0 ? void 0 : directorSort.addEventListener("click", sortByDirector);
                writerSort = document.getElementById("sort-writer");
                writerSort === null || writerSort === void 0 ? void 0 : writerSort.addEventListener("click", sortByWriter);
                searchButton = document.getElementById("search-episodes");
                searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener("click", searchEpisodes);
                return [2 /*return*/];
        }
    });
}); });
var truncatePlot = function (plot) {
    if (plot.length > 50) {
        return plot.substring(0, 47) + "...";
    }
    return plot;
};
var sortByRank = function () {
    var rankSort = document.getElementById("sort-id");
    currentSort = "rank";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    rankSort.classList.toggle("sorted");
    rankSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.rank - second.rank;
    });
    displayEpisodes(data);
};
var sortByName = function () {
    var nameSort = document.getElementById("sort-name");
    currentSort = "name";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    nameSort.classList.toggle("sorted");
    nameSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.title.localeCompare(second.title);
    });
    displayEpisodes(data);
};
var sortBySeries = function () {
    var seriesSort = document.getElementById("sort-series");
    currentSort = "series";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    seriesSort.classList.toggle("sorted");
    seriesSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.series - second.series;
    });
    displayEpisodes(data);
};
var sortByEra = function () {
    var eraSort = document.getElementById("sort-era");
    currentSort = "era";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    eraSort.classList.toggle("sorted");
    eraSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.era.localeCompare(second.era);
    });
    displayEpisodes(data);
};
var sortByBroadcast = function () {
    var broadcastSort = document.getElementById("sort-broadcast");
    currentSort = "broadcast_date";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    broadcastSort.classList.toggle("sorted");
    broadcastSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.broadcast_date.localeCompare(second.broadcast_date);
    });
    displayEpisodes(data);
};
var sortByDirector = function () {
    var directorSort = document.getElementById("sort-director");
    currentSort = "director";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    directorSort.classList.toggle("sorted");
    directorSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.director.localeCompare(second.director);
    });
    displayEpisodes(data);
};
var sortByWriter = function () {
    var writerSort = document.getElementById("sort-writer");
    currentSort = "writer";
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
    }
    writerSort.classList.toggle("sorted");
    writerSort.classList.toggle("unsorted");
    data.sort(function (first, second) {
        return first.writer.localeCompare(second.writer);
    });
    displayEpisodes(data);
};
var searchEpisodes = function () {
    var episodeSearch = document.getElementById("name-filter");
    var episodeValue = episodeSearch.value.toLowerCase();
    var eraSearch = document.getElementById("era-filter");
    var eraValue = eraSearch.value;
    var filteredEpisodes = data
        .filter(function (episode) { return episode.title.toLowerCase().includes(episodeValue); })
        .filter(function (episode) {
        var matchesName = episode.title.toLowerCase().includes(episodeValue);
        var matchesEra = !eraValue || episode.era === eraValue;
        return matchesName && matchesEra;
    });
    displayEpisodes(filteredEpisodes);
};
var loadData = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json")];
            case 1:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("HTTP error ".concat(response.status));
                }
                return [4 /*yield*/, response.json()];
            case 2:
                data_1 = _a.sent();
                return [2 /*return*/, data_1.episodes];
            case 3:
                error_1 = _a.sent();
                console.error('Error loading data:', error_1);
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
