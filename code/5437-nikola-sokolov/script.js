document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";
    const episodesList = document.querySelector(".episodes-list");
    const eraFilter = document.getElementById("era-filter");
    const doctorFilter = document.getElementById("doctor-filter");
    const companionFilter = document.getElementById("companion-filter");
    const nameFilter = document.getElementById("name-filter");
    let episodesData = [];
    let filteredData = [];
    let currentSort = { field: "rank", order: "asc" };

    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            episodesData = data.episodes;
            filteredData = [...episodesData];
            populateFilters();
            renderEpisodes();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const renderEpisodes = () => {
        episodesList.innerHTML = `<div class="episodes-header">
            <div class="header-cell" data-sort="rank">Rank</div>
            <div class="header-cell" data-sort="title">Name</div>
            <div class="header-cell" data-sort="series">Series</div>
            <div class="header-cell" data-sort="era">Era</div>
            <div class="header-cell" data-sort="broadcast_date">Broadcast Year</div>
            <div class="header-cell" data-sort="director">Director</div>
            <div class="header-cell" data-sort="writer">Writer</div>
            <div class="header-cell" data-sort="doctor">Doctor</div>
            <div class="header-cell" data-sort="companion">Companion</div>
            <div class="header-cell" data-sort="cast">Cast</div>
            <div class="header-cell" data-sort="plot">Plot</div>
        </div>`;

        filteredData.forEach(episode => {
            const eraIcon = `<img src="images/${episode.era.toLowerCase()}.jpg" class="era-icon" alt="${episode.era} icon">`;
            const broadcastYear = new Date(episode.broadcast_date).getFullYear();
            const doctorInfo = `${episode.doctor.actor} (${episode.doctor.incarnation})`;
            const companionInfo = episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : "N/A";
            const castCount = episode.cast.length;
            const plotPreview = truncateText(episode.plot, 50);
            const castList = formatCastList(episode.cast);
            
            const episodeRow = `
                <div class="episode-row">
                    <div class="episode-cell">${episode.rank}</div>
                    <div class="episode-cell">${episode.title}</div>
                    <div class="episode-cell">${episode.series}</div>
                    <div class="episode-cell">${eraIcon}${episode.era}</div>
                    <div class="episode-cell">${broadcastYear}</div>
                    <div class="episode-cell">${episode.director}</div>
                    <div class="episode-cell">${episode.writer}</div>
                    <div class="episode-cell">${doctorInfo}</div>
                    <div class="episode-cell">${companionInfo}</div>
                    <div class="episode-cell">${castCount}</div>
                    <div class="episode-cell plot-preview">${plotPreview}</div>
                </div>`;
            episodesList.insertAdjacentHTML("beforeend", episodeRow);
        });

        addSortingListeners();
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        const truncated = text.slice(0, maxLength).split(" ").slice(0, -1).join(" ");
        return `${truncated}...`;
    };

    const formatCastList = (cast) => {
        const sortedCast = cast.map(c => c.actor).sort();
        if (sortedCast.length <= 3) return sortedCast.join(" & ");
        return `${sortedCast.slice(0, 5).join(", ")}...`;
    };

    const addSortingListeners = () => {
        document.querySelectorAll(".header-cell").forEach(header => {
            header.addEventListener("click", () => {
                const field = header.dataset.sort;
                toggleSortOrder(field);
                sortEpisodes();
                renderEpisodes();
            });
        });
    };

    const toggleSortOrder = (field) => {
        if (currentSort.field === field) {
            currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
        } else {
            currentSort.field = field;
            currentSort.order = "asc";
        }
    };

    const sortEpisodes = () => {
        const { field, order } = currentSort;
        filteredData.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            if (field === "broadcast_date") {
                aValue = new Date(a.broadcast_date);
                bValue = new Date(b.broadcast_date);
            } else if (field === "doctor" || field === "companion") {
                aValue = a[field]?.actor || "";
                bValue = b[field]?.actor || "";
            } else if (field === "cast") {
                if (a.cast.length === b.cast.length) {
                    return a.cast[0]?.actor.localeCompare(b.cast[0]?.actor) * (order === "asc" ? 1 : -1);
                }
                return (a.cast.length - b.cast.length) * (order === "asc" ? 1 : -1);
            }

            return aValue > bValue ? (order === "asc" ? 1 : -1) : aValue < bValue ? (order === "asc" ? -1 : 1) : 0;
        });
    };

    const populateFilters = () => {
        const eras = [...new Set(episodesData.map(ep => ep.era))];
        const doctors = [...new Set(episodesData.map(ep => ep.doctor.actor))];
        const companions = [...new Set(episodesData.filter(ep => ep.companion).map(ep => ep.companion.actor))];

        populateSelect("era-filter", eras);
        populateSelect("doctor-filter", doctors);
        populateSelect("companion-filter", companions);
    };

    const populateSelect = (selectId, options) => {
        const select = document.getElementById(selectId);
        options.sort().forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
    };

    
    const filterEpisodes = () => {
        const nameValue = nameFilter.value.toLowerCase();
        const eraValue = eraFilter.value;
        const doctorValue = doctorFilter.value;
        const companionValue = companionFilter.value;

        filteredData = episodesData.filter(episode => {
            return (
                (episode.title.toLowerCase().includes(nameValue)) &&
                (eraValue === "" || episode.era === eraValue) &&
                (doctorValue === "" || episode.doctor.actor === doctorValue) &&
                (companionValue === "" || (episode.companion && episode.companion.actor === companionValue))
            );
        });

        renderEpisodes();
    };

    
    nameFilter.addEventListener("input", filterEpisodes);
    eraFilter.addEventListener("change", filterEpisodes);
    doctorFilter.addEventListener("change", filterEpisodes);
    companionFilter.addEventListener("change", filterEpisodes);

    
    fetchData();
});
