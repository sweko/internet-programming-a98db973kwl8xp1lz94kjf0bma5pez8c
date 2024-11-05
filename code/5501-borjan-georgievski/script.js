let data = [];
let currentSort = "rank";
let sortOrder = "asc";

const loadData = async () => {
    const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
    const data = await response.json();
    return data.episodes;
};

function displayEpisodes(episodes) {
    const container = document.getElementById("episode-rows");
    container.innerHTML = "";

    episodes.forEach(episode => displayEpisode(episode));
}

function displayEpisode(episode) {
    const container = document.getElementById("episode-rows");
    const row = document.createElement("div");
    row.classList.add("episode-row");

    row.appendChild(makeEpisodeDataDiv(episode.rank.toString()));
    row.appendChild(makeEpisodeDataDiv(episode.title));
    row.appendChild(makeEpisodeDataDiv(episode.series.toString()));

    const eraDiv = makeEpisodeDataDiv(episode.era);
    const eraIcon = document.createElement("img");
    if (episode.era === "Classic") {
        eraIcon.src = "images/classic.jpg"; 
    } else if (episode.era === "Modern") {
        eraIcon.src = "images/modern.jpg"; 
    } else if (episode.era === "Recent") {
        eraIcon.src = "images/recent.jpg"; 
    } 
   
    eraDiv.appendChild(eraIcon);
    row.appendChild(eraDiv);

    row.appendChild(makeEpisodeDataDiv(new Date(episode.broadcast_date).getFullYear().toString()));
    row.appendChild(makeEpisodeDataDiv(getDecade(episode.broadcast_date)));
    row.appendChild(makeEpisodeDataDiv(episode.director));
    row.appendChild(makeEpisodeDataDiv(episode.writer));

    const doctorText = `${episode.doctor.actor} (${episode.doctor.incarnation})`;
    row.appendChild(makeEpisodeDataDiv(doctorText));

    let companionText = "N/A";
    if (episode.companion) {
        companionText = `${episode.companion.actor} (${episode.companion.character})`;
    }
    row.appendChild(makeEpisodeDataDiv(companionText));

    row.appendChild(makeEpisodeDataDiv(episode.cast.length.toString()));
    row.appendChild(makeEpisodeDataDiv(smaliPlot(episode.plot)));

    container.appendChild(row);
}

function makeEpisodeDataDiv(content) {
    const div = document.createElement("div");
    div.classList.add("episode-cell");

    if (typeof content === "string") {
        div.textContent = content;
    } else {
        div.appendChild(content); 
    }

    return div;
}

function getDecade(dateStr) {
    const year = new Date(dateStr).getFullYear();
    const decadeStart = Math.floor(year / 10) * 10;
    return `${decadeStart}s`;
}

function smaliPlot(plot) {
    if (plot.length > 50) {
        const endPosition = plot.lastIndexOf(" ", 50);
        return plot.substring(0, endPosition) + "...";
    }
    return plot;
}

function sortEpisodes(field) {
    sortOrder = (sortOrder === "asc") ? "desc" : "asc";
    data.sort((a, b) => compareEpisodes(a, b, field));
    displayEpisodes(data);
}

function compareEpisodes(a, b, field) {
    if (field === "era") {
        return compareEra(a.era, b.era);
    } 
    if (field === "cast") {
        return compareCast(a, b);
    }
    if (field === "doctor" || field === "companion") {
        return compareActors(a[field], b[field]);
    }
    return compareValues(a[field], b[field]);
}

function compareEra(eraA, eraB) {
    const eraOrder = { "Classic": 1, "Modern": 2, "Recent": 3 };
    if (sortOrder === "asc") {
        return eraOrder[eraA] - eraOrder[eraB];
    } else {
        return eraOrder[eraB] - eraOrder[eraA];
    }
}

function compareCast(a, b) {
    const lengthDifference = a.cast.length - b.cast.length;
    if (lengthDifference !== 0) {
        return sortOrder === "asc" ? lengthDifference : -lengthDifference;
    }
    return sortOrder === "asc" ? a.cast[0]?.actor.localeCompare(b.cast[0]?.actor || "") : b.cast[0]?.actor.localeCompare(a.cast[0]?.actor || "");
}

function compareActors(actorA, actorB) {
    if (sortOrder === "asc") {
        return actorA.actor.localeCompare(actorB.actor);
    } else {
        return actorB.actor.localeCompare(actorA.actor);
    }
}

function compareValues(valueA, valueB) {
    if (sortOrder === "asc") {
        return valueA < valueB ? -1 : 1;
    } else {
        return valueA > valueB ? -1 : 1;
    }
}

function filterEpisodes() {
    const nameFilter = document.getElementById("name-filter").value.toLowerCase();
    const eraFilter = document.getElementById("era-filter").value;

    const filteredData = data.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameFilter);
        const matchesEra = !eraFilter || episode.era === eraFilter;
        return matchesName && matchesEra;
    });

    displayEpisodes(filteredData);
}

function populateFilters() {
    const eras = Array.from(new Set(data.map(episode => episode.era)));
    const eraFilter = document.getElementById("era-filter");
    eras.forEach(era => {
        const option = document.createElement("option");
        option.value = era;
        option.textContent = era;
        eraFilter.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const episodesData = await loadData();
    data.push(...episodesData);
    displayEpisodes(data);
    populateFilters();

    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener("click", () => {
            const sortField = header.getAttribute("data-sort");
            sortEpisodes(sortField);
        });
    });

    document.getElementById("name-filter").addEventListener("input", filterEpisodes);
    document.getElementById("era-filter").addEventListener("change", filterEpisodes);
});
