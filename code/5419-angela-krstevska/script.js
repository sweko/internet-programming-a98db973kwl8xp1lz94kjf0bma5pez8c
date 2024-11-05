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
var getEpisodes = function () { return __awaiter(_this, void 0, void 0, function () {
    var response, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json")];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                console.log(data);
                return [2 /*return*/, data.episodes];
        }
    });
}); };
var showEpisodes = function (episodes) {
    var container = document.getElementById("episodes-container");
    container.innerHTML = "";
    for (var _i = 0, episodes_1 = episodes; _i < episodes_1.length; _i++) {
        var episode = episodes_1[_i];
        showEpisode(episode);
    }
};
var showEpisode = function (episode) {
    var container = document.getElementById("episodes-container");
    var row = document.createElement("div");
    row.classList.add("episode-row");
    row.appendChild(makeEpisodeDataDiv(episode.rank.toString()));
    row.appendChild(makeEpisodeDataDiv(episode.title));
    row.appendChild(makeEpisodeDataDiv(episode.series.toString()));
    row.appendChild(makeEpisodeDataDiv(episode.era));
    row.appendChild(makeEpisodeDataDiv(getBroadcastYear(episode).toString()));
    row.appendChild(makeEpisodeDataDiv("".concat(getBroadcastDecade(episode), "s")));
    row.appendChild(makeEpisodeDataDiv(episode.director));
    row.appendChild(makeEpisodeDataDiv(episode.writer));
    row.appendChild(makeEpisodeDataDiv(getDoctor(episode)));
    row.appendChild(makeEpisodeDataDiv(getCompanion(episode)));
    var castCell = document.createElement("div");
    castCell.classList.add("episode-cell");
    castCell.appendChild(displayCastMembers(episode));
    row.appendChild(castCell);
    row.appendChild(makeEpisodeDataDiv(episode.plot));
    container === null || container === void 0 ? void 0 : container.appendChild(row);
};
var makeEpisodeDataDiv = function (data) {
    var div = document.createElement("div");
    div.classList.add("episode-cell");
    div.textContent = data;
    return div;
};
var getBroadcastYear = function (episode) {
    var broadcastDate = new Date(episode.broadcast_date);
    return broadcastDate.getFullYear();
};
var getDoctor = function (episode) {
    var doctor = episode.doctor;
    var actor = doctor.actor;
    var incarnation = doctor.incarnation;
    return "".concat(actor, " (").concat(incarnation, ")");
};
var getCompanion = function (episode) {
    var companion = episode.companion;
    var actor = companion.actor;
    var character = companion.character;
    if (character !== undefined)
        return "".concat(actor, " (").concat(character, ")");
    return "".concat(actor);
};
var getBroadcastDecade = function (episode) {
    var broadcastDate = new Date(episode.broadcast_date);
    var year = broadcastDate.getFullYear();
    var decade = year - year % 10;
    return decade;
};
var displayCastMembers = function (episode) {
    var cast = episode.cast;
    cast.sort(function (a, b) { return a.actor.localeCompare(b.actor); });
    var list = document.createElement("ul");
    for (var _i = 0, cast_1 = cast; _i < cast_1.length; _i++) {
        var member = cast_1[_i];
        var li = document.createElement("li");
        li.innerHTML = "<strong>".concat(member.actor, "</strong> (").concat(member.character, ")");
        list.appendChild(li);
    }
    return list;
};
var extractEras = function (episodes) {
    var allEras = episodes.map(function (episode) { return episode.era; });
    var unique = allEras.filter(function (value, index, self) { return self.indexOf(value) === index; });
    return unique;
};
var displayEras = function (eras) {
    var select = document.getElementById("era-filter");
    select.innerHTML = "";
    var none = document.createElement("option");
    none.text = "--- Select ---";
    none.value = "";
    select.appendChild(none);
    for (var _i = 0, eras_1 = eras; _i < eras_1.length; _i++) {
        var era = eras_1[_i];
        var option = document.createElement("option");
        option.text = era;
        option.value = era;
        select.appendChild(option);
    }
};
var extractDoctors = function (episodes) {
    var allDoctors = episodes.map(function (episode) { return episode.doctor.actor; });
    var unique = allDoctors.filter(function (value, index, self) { return self.indexOf(value) === index; });
    return unique;
};
var displayDoctors = function (doctors) {
    var select = document.getElementById("doctor-filter");
    select.innerHTML = "";
    var none = document.createElement("option");
    none.text = "--- Select ---";
    none.value = "";
    select.appendChild(none);
    for (var _i = 0, doctors_1 = doctors; _i < doctors_1.length; _i++) {
        var doctor = doctors_1[_i];
        var option = document.createElement("option");
        option.text = doctor;
        option.value = doctor;
        select.appendChild(option);
    }
};
var extractCompanions = function (episodes) {
    var allCompanions = episodes.map(function (episode) { return episode.companion.actor; });
    var unique = allCompanions.filter(function (value, index, self) { return self.indexOf(value) === index; });
    return unique;
};
var displayCompanions = function (companions) {
    var select = document.getElementById("companion-filter");
    select.innerHTML = "";
    var none = document.createElement("option");
    none.text = "--- Select ---";
    none.value = "";
    select.appendChild(none);
    for (var _i = 0, companions_1 = companions; _i < companions_1.length; _i++) {
        var companion = companions_1[_i];
        var option = document.createElement("option");
        option.text = companion;
        option.value = companion;
        select.appendChild(option);
    }
};
var searchEpisodes = function () {
    var nameSearch = document.getElementById("name-filter");
    var nameValue = nameSearch.value.toLowerCase();
    var eraSearch = document.getElementById("era-filter");
    var eraValue = eraSearch.value;
    var doctorSearch = document.getElementById("doctor-filter");
    var doctorValue = doctorSearch.value;
    var companionSearch = document.getElementById("companion-filter");
    var companionValue = companionSearch.value;
    var filteredEpisodes = data
        .filter(function (episode) { return episode.title.toLowerCase().includes(nameValue); })
        .filter(function (episode) {
        if (eraValue === "") {
            return true;
        }
        return eraValue === episode.era;
    })
        .filter(function (episode) {
        if (doctorValue === "") {
            return true;
        }
        return doctorValue === episode.doctor.actor;
    })
        .filter(function (episode) {
        if (companionValue === "") {
            return true;
        }
        return companionValue === episode.companion.actor;
    });
    showEpisodes(filteredEpisodes);
};
var currentSort = { field: "rank", direction: true };
var sortByField = function (field) {
    if (currentSort.field === field) {
        currentSort.direction = !currentSort.direction;
    }
    else {
        currentSort.field = field;
        currentSort.direction = true;
    }
    var allSorters = document.getElementsByClassName("sorter");
    for (var index = 0; index < allSorters.length; index++) {
        var sorter = allSorters[index];
        sorter.classList.remove("sorted");
        sorter.classList.add("unsorted");
        sorter.innerHTML = '<i class="fa fa-sort"></i>';
    }
    var currentSorter = document.getElementById("sort-".concat(currentSort.field));
    currentSorter.classList.toggle("sorted", currentSort.direction);
    currentSorter.classList.toggle("unsorted", !currentSort.direction);
    currentSorter.innerHTML = currentSort.direction
        ? '<i class="fa fa-sort-up"></i>'
        : '<i class="fa fa-sort-down"></i>';
    var sortDirection = currentSort.direction ? 1 : -1;
    //1 asc -1 desc 
    data.sort(function (first, second) {
        var firstValue;
        var secondValue;
        if (field === "cast") {
            var castCountComparison = first.cast.length - second.cast.length;
            if (castCountComparison !== 0) {
                return castCountComparison * sortDirection;
            }
            var firstSortedCast = first.cast.map(function (member) { return member.actor; }).sort();
            var secondSortedCast = second.cast.map(function (member) { return member.actor; }).sort();
            for (var i = 0; i < Math.min(firstSortedCast.length, secondSortedCast.length); i++) {
                var comparison = firstSortedCast[i].localeCompare(secondSortedCast[i]);
                if (comparison !== 0) {
                    return comparison * sortDirection;
                }
            }
            return (firstSortedCast.length - secondSortedCast.length) * sortDirection;
        }
        else if (field === "doctor") {
            firstValue = first.doctor.actor;
            secondValue = second.doctor.actor;
        }
        else if (field === "companion") {
            firstValue = first.companion.actor;
            secondValue = second.companion.actor;
        }
        else if (field === "broadcast_decade") {
            firstValue = getBroadcastDecade(first);
            secondValue = getBroadcastDecade(second);
        }
        else {
            if (typeof first[field] === "string" &&
                typeof second[field] === "string") {
                return first[field].localeCompare(second[field]) * sortDirection;
            }
            return (first[field] - second[field]) * sortDirection;
        }
        if (typeof firstValue === "string" && typeof secondValue === "string") {
            return firstValue.localeCompare(secondValue) * sortDirection;
        }
        return (firstValue - secondValue) * sortDirection;
    });
    showEpisodes(data);
};
var sortByRank = function () { return sortByField("rank"); };
var sortByTitle = function () { return sortByField("title"); };
var sortBySeries = function () { return sortByField("series"); };
var sortByDirector = function () { return sortByField("director"); };
var sortByWriter = function () { return sortByField("writer"); };
var sortByPlot = function () { return sortByField("plot"); };
var sortByCast = function () { return sortByField("cast"); };
var sortByEra = function () { return sortByField("era"); };
var sortByDoctor = function () { return sortByField("doctor"); };
var sortByCompanion = function () { return sortByField("companion"); };
var sortByBroadcastYear = function () { return sortByField("broadcast_date"); };
var sortByBroadcastDecade = function () { return sortByField("broadcast_decade"); };
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    var loadData, eras, doctors, companions, rankSort, titleSort, seriesSort, directorSort, writerSort, plotSort, castSort, eraSort, yearSort, doctorSort, companionSort, decadeSort, searchButton;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getEpisodes()];
            case 1:
                loadData = _a.sent();
                data.push.apply(data, loadData);
                showEpisodes(data);
                eras = extractEras(data);
                displayEras(eras);
                doctors = extractDoctors(data);
                displayDoctors(doctors);
                companions = extractCompanions(data);
                displayCompanions(companions);
                rankSort = document.getElementById("sort-rank");
                rankSort.style.cursor = "pointer";
                rankSort === null || rankSort === void 0 ? void 0 : rankSort.addEventListener("click", sortByRank);
                titleSort = document.getElementById("sort-title");
                titleSort.style.cursor = "pointer";
                titleSort === null || titleSort === void 0 ? void 0 : titleSort.addEventListener("click", sortByTitle);
                seriesSort = document.getElementById("sort-series");
                seriesSort.style.cursor = "pointer";
                seriesSort === null || seriesSort === void 0 ? void 0 : seriesSort.addEventListener("click", sortBySeries);
                directorSort = document.getElementById("sort-director");
                directorSort.style.cursor = "pointer";
                directorSort === null || directorSort === void 0 ? void 0 : directorSort.addEventListener("click", sortByDirector);
                writerSort = document.getElementById("sort-writer");
                writerSort.style.cursor = "pointer";
                writerSort === null || writerSort === void 0 ? void 0 : writerSort.addEventListener("click", sortByWriter);
                plotSort = document.getElementById("sort-plot");
                plotSort.style.cursor = "pointer";
                plotSort === null || plotSort === void 0 ? void 0 : plotSort.addEventListener("click", sortByPlot);
                castSort = document.getElementById("sort-cast");
                castSort.style.cursor = "pointer";
                castSort === null || castSort === void 0 ? void 0 : castSort.addEventListener("click", sortByCast);
                eraSort = document.getElementById("sort-era");
                eraSort.style.cursor = "pointer";
                eraSort === null || eraSort === void 0 ? void 0 : eraSort.addEventListener("click", sortByEra);
                yearSort = document.getElementById("sort-broadcast_date");
                yearSort.style.cursor = "pointer";
                yearSort === null || yearSort === void 0 ? void 0 : yearSort.addEventListener("click", sortByBroadcastYear);
                doctorSort = document.getElementById("sort-doctor");
                doctorSort.style.cursor = "pointer";
                doctorSort === null || doctorSort === void 0 ? void 0 : doctorSort.addEventListener("click", sortByDoctor);
                companionSort = document.getElementById("sort-companion");
                companionSort.style.cursor = "pointer";
                companionSort === null || companionSort === void 0 ? void 0 : companionSort.addEventListener("click", sortByCompanion);
                decadeSort = document.getElementById("sort-broadcast_decade");
                decadeSort.style.cursor = "pointer";
                decadeSort === null || decadeSort === void 0 ? void 0 : decadeSort.addEventListener("click", sortByBroadcastDecade);
                searchButton = document.getElementById("search-episodes");
                searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener("click", searchEpisodes);
                return [2 /*return*/];
        }
    });
}); });
