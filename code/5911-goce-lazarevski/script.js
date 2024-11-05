const fetchData = async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
        const data = await response.json();
        console.log(data.episodes);
        return data.episodes;
    } catch (error) {
        console.error("Error while fetching data!");
    }
};

const populateFilters = (data) => {
    const eraFilter = document.querySelector("#era-filter");
    const doctorFilter = document.querySelector("#doctor-filter");
    const companionFilter = document.querySelector("#companion-filter");

    const eras = [...new Set(data.map(episode => episode.era))];
    const doctors = [...new Set(data.map(episode => episode.doctor.actor))];
    const companions = [...new Set(data.map(episode => episode.companion 
        && episode.companion.actor).filter(Boolean))
    ];
    
    eras.forEach(era => {
        const option = document.createElement("option");
        option.value = era;
        option.text = era;
        eraFilter.appendChild(option);
    });

    doctors.forEach(doctor => {
        const option = document.createElement("option");
        option.value = doctor;
        option.text = doctor;
        doctorFilter.appendChild(option);
    });

    companions.forEach(companion => {
        const option = document.createElement("option");
        option.value = companion;
        option.text = companion;
        companionFilter.appendChild(option);
    });
};

const displayListOfEpisodes = (episodes) => {
    const episodesList = document.querySelector(".episodes-list");
    episodesList.innerHTML = `
        <div class="episodes-header">
            <div class="header-cell" data-sort="rank">Rank</div>
            <div class="header-cell" data-sort="name">Name</div>
            <div class="header-cell" data-sort="series">Series</div>
            <div class="header-cell" data-sort="era">Era</div>
            <div class="header-cell" data-sort="broadcast">Broadcast Year</div>
            <div class="header-cell" data-sort="director">Director</div>
            <div class="header-cell" data-sort="writer">Writer</div>
            <div class="header-cell" data-sort="doctor">Doctor</div>
            <div class="header-cell" data-sort="companion">Companion</div>
            <div class="header-cell" data-sort="cast">Cast</div>
            <div class="header-cell" data-sort="plot">Plot</div>
        </div>
    `;
    
    episodes.forEach(episode => {
        const episodeRow = `
            <div class="episode-row">
                <div class="episode-cell" data-sort="rank">${episode.rank}</div>
                <div class="episode-cell" data-sort="name">${episode.title}</div>
                <div class="episode-cell" data-sort="series">${episode.series}</div>
                <div class="episode-cell" data-sort="era">${episode.era}</div>
                <div class="episode-cell" data-sort="broadcast">${new Date(episode.broadcast_date).getFullYear()}</div>
                <div class="episode-cell" data-sort="director">${episode.director}</div>
                <div class="episode-cell" data-sort="writer">${episode.writer}</div>
                <div class="episode-cell" data-sort="doctor">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
                <div class="episode-cell" data-sort="companion">
                    ${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : ''}
                </div>
                <div class="episode-cell" data-sort="cast">
                    ${episode.cast.map(castMember => `${castMember.actor} (${castMember.character})`).join(', ')}
                </div>
                <div class="episode-cell plot-preview">${episode.plot}</div>
            </div>
        `;
        episodesList.innerHTML += episodeRow;
    });
};

const applyFilters = (data) => {
    const nameFilter = document.querySelector("#name-filter").value.toLowerCase();
    const eraFilter = document.querySelector("#era-filter").value;
    const doctorFilter = document.querySelector("#doctor-filter").value;
    const companionFilter = document.querySelector("#companion-filter").value;
    
    const filteredEpisodes = data.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameFilter);
        const matchesEra = !eraFilter || episode.era === eraFilter;
        const matchesDoctor = !doctorFilter || episode.doctor.actor === doctorFilter;
        const matchesCompanion = !companionFilter || (episode.companion && episode.companion.actor === companionFilter);
        return matchesName && matchesEra && matchesDoctor && matchesCompanion;
    });
    
    displayListOfEpisodes(filteredEpisodes);
};

const sortEpisodes = (data, key, order) => {
    return data.slice().sort((a, b) => {
        let valueA, valueB;
        if (key === 'era') {
            const eraOrder = { "Classic": 1, "Modern": 2, "Recent": 3 };
            valueA = eraOrder[a.era];
            valueB = eraOrder[b.era];
        } else if (key === "cast") {
            valueA = a.cast.length;
            valueB = b.cast.length;
        } else if (key === "broadcast") {
            valueA = new Date(a.broadcast_date).getFullYear();
            valueB = new Date(b.broadcast_date).getFullYear();
        } else if (key === "doctor") {
            valueA = a.doctor.actor ? a.doctor.actor.toLowerCase() : '';
            valueB = b.doctor.actor ? b.doctor.actor.toLowerCase() : '';
        } else {
            valueA = a[key] ? a[key].toString().toLowerCase() : '';
            valueB = b[key] ? b[key].toString().toLowerCase() : '';
        }
        return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * (order === 'asc' ? 1 : -1);
    });
};



document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchData();
    displayListOfEpisodes(data);
    populateFilters(data);
    
    document.querySelector("#name-filter").addEventListener("input", () => applyFilters(data));
    document.querySelector("#era-filter").addEventListener("change", () => applyFilters(data));
    document.querySelector("#doctor-filter").addEventListener("change", () => applyFilters(data));
    document.querySelector("#companion-filter").addEventListener("change", () => applyFilters(data));
    
    document.querySelectorAll(".header-cell").forEach(header => {
        header.dataset.order = "asc";
        header.addEventListener("click", () => {
            const sortKey = header.dataset.sort;
            const currentOrder = header.dataset.order === "asc" ? "desc" : "asc";
            header.dataset.order = currentOrder;
            const sortedData = sortEpisodes(data, sortKey, currentOrder);
            displayListOfEpisodes(sortedData);
            
            if(currentOrder === "asc") {
                console.log(`Sorting ${sortKey} in ascending order`);
            } else {
                console.log(`Sorting ${sortKey} in descending order`);
            }
        });
    });
});