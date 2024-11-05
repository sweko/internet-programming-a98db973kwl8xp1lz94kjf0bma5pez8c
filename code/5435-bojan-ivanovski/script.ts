
interface Doctor {
    actor: string
    incarnation: string
}

interface Companion {
    actor: string
    character: string
}

interface Cast {
    actor: string
    character: string
}

interface Episode {
    rank: number
    title: string
    series: number
    era: string
    broadcast_date: string
    director: string
    writer: string
    plot: string
    doctor: Doctor[]
    companion: Companion[]
    cast: Cast[]
}

document.addEventListener("DOMContentLoaded", siteCode)

let episodes: Episode[] = []
let rankSortAscending = true;
let titleSortAscending = true;
let seriesSortAscending = true;
let eraSortAscending = true;
let broadcastDateSortAscending = true;
let directorSortAscending = true;
let writerSortAscending = true;
let plotSortAscending = true;
let doctorSortAscending = true;
let companionSortAscending = true;
let castSortAscending = true;

async function siteCode() {
    try {
        const data = await loadData()
        episodes = data.episodes

        displayEpisodes(episodes)
        fillEras(episodes)

    const rankSort = document.getElementById("rank-sort")!;
    rankSort.addEventListener("click", sortByRank);

    const titleSort = document.getElementById("title-sort")!
    titleSort.addEventListener("click", sortByTitle);

    const seriesSort = document.getElementById("series-sort")!
    seriesSort.addEventListener("click", sortBySeries);

    const eraSort = document.getElementById("era-sort")!
    eraSort.addEventListener("click", sortByEra);

    const broadcastDateSort = document.getElementById("broadcast-sort")!
    broadcastDateSort.addEventListener("click", sortByBroadcast);

    const directorSort = document.getElementById("director-sort")!;
    directorSort.addEventListener("click", sortByDirector);

    const writerSort = document.getElementById("writer-sort")!;
    writerSort.addEventListener("click", sortByWriter);

    const plotSort = document.getElementById("plot-sort")!;
    plotSort.addEventListener("click", sortByPlot);

    const doctorSort = document.getElementById("doctor-sort")!;
    doctorSort.addEventListener("click", sortByDoctor);

    const companionSort = document.getElementById("companion-sort")!;
    companionSort.addEventListener("click", sortByCompanion);

    const castSort = document.getElementById("cast-sort")!;
    castSort.addEventListener("click", sortByCast);

    const applyFilterButton = document.getElementById("apply-filter")!;
    applyFilterButton.addEventListener("click", applyFilter);

    }catch(err) {
        console.log("Error", err)
    }
}

const sortByRank = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        rankSortAscending ? a.rank - b.rank : b.rank - a.rank
    );
    displayEpisodes(sortedEpisodes);
    rankSortAscending = !rankSortAscending;

    const rankSort = document.getElementById("rank-sort")!;
    rankSort.innerText = rankSortAscending ? "Rank ▲" : "Rank ▼";
};

const sortByTitle = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        titleSortAscending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    displayEpisodes(sortedEpisodes);
    titleSortAscending = !titleSortAscending;

    const titleSort = document.getElementById("title-sort")!;
    titleSort.innerText = titleSortAscending ? "Title ▲" : "Title ▼";
};

const sortBySeries = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        seriesSortAscending ? a.series - b.series : b.series - a.series
    );
    displayEpisodes(sortedEpisodes);
    seriesSortAscending = !seriesSortAscending;

    const seriesSort = document.getElementById("series-sort")!;
    seriesSort.innerText = seriesSortAscending ? "Series ▲" : "Series ▼";
};

const sortByEra = () => {
    const eraOrder: { [key: string]: number } = { "Classic": 1, "Modern": 2, "Recent": 3 };
    
    const sortedEpisodes = episodes.slice().sort((a, b) => {
        const eraA = eraOrder[a.era] !== undefined ? eraOrder[a.era] : 0; // Default to 0 for unrecognized eras
        const eraB = eraOrder[b.era] !== undefined ? eraOrder[b.era] : 0; // Default to 0 for unrecognized eras

        return eraSortAscending ? eraA - eraB : eraB - eraA;
    });

    displayEpisodes(sortedEpisodes);
    eraSortAscending = !eraSortAscending;

    const eraSort = document.getElementById("era-sort")!;
    eraSort.innerText = eraSortAscending ? "Era ▲" : "Era ▼";
};

const sortByBroadcast = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        broadcastDateSortAscending 
            ? new Date(a.broadcast_date).getTime() - new Date(b.broadcast_date).getTime() 
            : new Date(b.broadcast_date).getTime() - new Date(a.broadcast_date).getTime()
    );
    displayEpisodes(sortedEpisodes);
    broadcastDateSortAscending = !broadcastDateSortAscending;

    const broadcastSort = document.getElementById("broadcast-sort")!;
    broadcastSort.innerText = broadcastDateSortAscending ? "Broadcast ▲" : "Broadcast ▼";
};

const sortByDirector = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        directorSortAscending ? a.director.localeCompare(b.director) : b.director.localeCompare(a.director)
    );
    displayEpisodes(sortedEpisodes);
    directorSortAscending = !directorSortAscending;

    const directorSort = document.getElementById("director-sort")!;
    directorSort.innerText = directorSortAscending ? "Director ▲" : "Director ▼";
};

const sortByWriter = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        writerSortAscending ? a.writer.localeCompare(b.writer) : b.writer.localeCompare(a.writer)
    );
    displayEpisodes(sortedEpisodes);
    writerSortAscending = !writerSortAscending;

    const writerSort = document.getElementById("writer-sort")!;
    writerSort.innerText = writerSortAscending ? "Writer ▲" : "Writer ▼";
};

const sortByPlot = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => 
        plotSortAscending ? a.plot.localeCompare(b.plot) : b.plot.localeCompare(a.plot)
    );
    displayEpisodes(sortedEpisodes);
    plotSortAscending = !plotSortAscending;

    const plotSort = document.getElementById("plot-sort")!;
    plotSort.innerText = plotSortAscending ? "Plot ▲" : "Plot ▼";
};

const sortByDoctor = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => {
        const doctorA = a.doctor.length > 0 ? a.doctor[0].actor : ""; 
        const doctorB = b.doctor.length > 0 ? b.doctor[0].actor : ""; 
        return doctorSortAscending ? doctorA.localeCompare(doctorB) : doctorB.localeCompare(doctorA);
    });
    displayEpisodes(sortedEpisodes);
    doctorSortAscending = !doctorSortAscending;

    const doctorSort = document.getElementById("doctor-sort")!;
    doctorSort.innerText = doctorSortAscending ? "Doctor ▲" : "Doctor ▼";
};

const sortByCompanion = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => {
        const companionA = a.companion.length > 0 ? a.companion[0].actor : ""; 
        const companionB = b.companion.length > 0 ? b.companion[0].actor : ""; 
        return companionSortAscending ? companionA.localeCompare(companionB) : companionB.localeCompare(companionA);
    });
    displayEpisodes(sortedEpisodes);
    companionSortAscending = !companionSortAscending;

    const companionSort = document.getElementById("companion-sort")!;
    companionSort.innerText = companionSortAscending ? "Companion ▲" : "Companion ▼";
};

const sortByCast = () => {
    const sortedEpisodes = episodes.slice().sort((a, b) => {
        const castLengthDiff = a.cast.length - b.cast.length;
        if (castLengthDiff !== 0) {
            return castSortAscending ? castLengthDiff : -castLengthDiff;
        }
        const castA = a.cast.length > 0 ? a.cast[0].actor : "";
        const castB = b.cast.length > 0 ? b.cast[0].actor : "";
        return castSortAscending ? castA.localeCompare(castB) : castB.localeCompare(castA);
    });
    displayEpisodes(sortedEpisodes);
    castSortAscending = !castSortAscending;

    const castSort = document.getElementById("cast-sort")!;
    castSort.innerText = castSortAscending ? "Cast ▲" : "Cast ▼";
};

const fillEras = (episodes: Episode[]) => {
    const filter = document.getElementById("era-filter")!;

    filter.innerHTML = '<option value="all" selected>All</option>';

    const eras = Array.from(new Set(episodes.map(episodes => episodes.era)));

    for (const era of eras) {
        const option = document.createElement("option");
        option.value = era
        option.innerHTML = era
        filter.appendChild(option);
    }
}

const applyFilter = () => {
    const nameElement = document.getElementById("name-filter") as HTMLInputElement;
    const name = nameElement.value.toLowerCase().trim();

    const eraElement = document.getElementById("era-filter") as HTMLSelectElement;
    const era = eraElement.value;

    let filteredEpisodes = episodes

    if (name !== "") {
        filteredEpisodes = filteredEpisodes.filter(episode => episode.title.toLowerCase().includes(name.toLowerCase()));
    }

    if (era !== "all") {
        filteredEpisodes = filteredEpisodes.filter(episode => episode.era.toLowerCase() === era.toLowerCase());
    }

    displayEpisodes(filteredEpisodes)
}

const loadData = async () => {
    const dataUri = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
    const response = await fetch(dataUri);

    if (!response.ok) {
        throw new Error("The data is not there");
    }

    const data = await response.json();
    return data;
}

const displayEpisodes = (episodes: Episode[]) => {
    const container = document.getElementById("episode-container")!
    container.innerHTML = ""
    for(const episode of episodes) {
        const episodeRow = generateEpisodeRow(episode)
        container.appendChild(episodeRow)
    }
}

const generateEpisodeRow = (episode: Episode) => {
    const row = document.createElement("div")
    row.classList.add("episode-row")

    const rankCell = document.createElement("div");
    rankCell.classList.add("episode-data", "episode-rank");
    rankCell.innerHTML = episode.rank.toString()
    row.appendChild(rankCell);

    const titleCell = document.createElement("div");
    titleCell.classList.add("episode-data", "episode-name");
    titleCell.innerHTML = episode.title
    row.appendChild(titleCell);

    const seriesCell = document.createElement("div");
    seriesCell.classList.add("episode-data", "episode-series");
    seriesCell.innerHTML = episode.series.toString()
    row.appendChild(seriesCell);

    const eraCell = document.createElement("div");
    eraCell.classList.add("episode-data", "episode-era");
    eraCell.innerHTML = episode.era
    row.appendChild(eraCell);

    const eraIconCell = document.createElement("div");
    eraIconCell.classList.add("episode-data", "episode-era-icon");
    
    const eraIcon = document.createElement("img");
    eraIcon.alt = `${episode.era} Era Icon`;
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

    const broadcastDateCell = document.createElement("div");
    broadcastDateCell.classList.add("episode-data", "episode-broadcastDate");
    broadcastDateCell.innerHTML = episode.broadcast_date
    row.appendChild(broadcastDateCell);

    const directorCell = document.createElement("div");
    directorCell.classList.add("episode-data", "episode-director");
    directorCell.innerHTML = episode.director
    row.appendChild(directorCell);
    
    const writerCell = document.createElement("div")
    writerCell.classList.add("episode-data", "episode-writer")
    writerCell.innerHTML = episode.writer
    row.appendChild(writerCell)

    const doctorCell = document.createElement("div");
    doctorCell.classList.add("episode-data", "episode-doctor");
    if (Array.isArray(episode.doctor)) {
        doctorCell.innerHTML = episode.doctor.map(doctor => 
            `${doctor.actor} as the ${doctor.incarnation}`
        ).join(", ");
    } else {
        doctorCell.innerHTML = "No doctors available";
    }
    row.appendChild(doctorCell);

    const companionCell = document.createElement("div");
    companionCell.classList.add("episode-data", "episode-companion");
    if (Array.isArray(episode.companion) && episode.companion.length > 0) {
        companionCell.innerHTML = episode.companion.map(companion => 
            `${companion.actor} as ${companion.character}`
        ).join(", ");
    } else {
        companionCell.innerHTML = "No companions available";
    }
    row.appendChild(companionCell);

    const castCell = document.createElement("div");
    castCell.classList.add("episode-data", "episode-cast");
    castCell.innerHTML = episode.cast.map(castMember => 
    `${castMember.actor} as ${castMember.character}`
    ).join(", ");
    row.appendChild(castCell);

    const plotCell = document.createElement("div");
    plotCell.classList.add("episode-data","episode-plot");
    plotCell.innerHTML= episode.plot
    row.appendChild(plotCell);

    return row;

}
