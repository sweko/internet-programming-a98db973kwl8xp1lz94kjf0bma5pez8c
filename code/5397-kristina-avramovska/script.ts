interface Episode {
    rank: number;
    title: string;
    series: number;
    era: string;
    broadcast_date: string;
    director: string;
    writer: string;
    doctor: Doctor;
    companion?: Companion;
    cast: CastMember[];
}

interface Doctor {
    actor: string;
    incarnation: string;
}

interface Companion {
    actor: string;
    character: string;
}

interface CastMember {
    actor: string;
    character: string;
}

let episodesData: Episode[] = [];
let currentSort: keyof Episode | 'castCount' = 'rank';
let currentSortOrder: 'asc' | 'desc' = 'asc';

document.addEventListener("DOMContentLoaded", async () => {
    episodesData = await loadData();
    populateFilters(episodesData);
    displayEpisodes(episodesData);
    addSortListeners();
    addFilterListeners();
});

async function loadData(): Promise<Episode[]> {
    try {
        const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
        const data = await response.json();
        return data.episodes;
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
}

function displayEpisodes(episodes: Episode[]): void {
    const container = document.getElementById("episode-container")!;
    container.querySelectorAll(".episode-row").forEach(row => row.remove());

    episodes.forEach(displayEpisode);
}

function displayEpisode(episode: Episode): void {
    const container = document.getElementById("episode-container")!;
    const row = document.createElement("div");
    row.classList.add("episode-row");

    row.appendChild(makeEpisodeDataDiv(episode.rank.toString()));
    row.appendChild(makeEpisodeDataDiv(episode.title));
    row.appendChild(makeEpisodeDataDiv(episode.series.toString()));
    row.appendChild(makeEpisodeDataDiv(episode.era));
    row.appendChild(makeEpisodeDataDiv(new Date(episode.broadcast_date).getFullYear().toString()));
    row.appendChild(makeEpisodeDataDiv(episode.director));
    row.appendChild(makeEpisodeDataDiv(episode.writer));
    row.appendChild(makeEpisodeDataDiv(`${episode.doctor.actor} (${episode.doctor.incarnation})`));
    row.appendChild(makeEpisodeDataDiv(episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : "N/A"));
    row.appendChild(makeEpisodeDataDiv(episode.cast.length.toString()));

    container.appendChild(row);
}

function makeEpisodeDataDiv(data: string): HTMLDivElement {
    const div = document.createElement("div");
    div.classList.add("episode-cell");
    div.textContent = data;
    return div;
}

function populateFilters(episodes: Episode[]): void {
    const eraFilter = document.getElementById("era-filter")! as HTMLSelectElement;
    const doctorFilter = document.getElementById("doctor-filter")! as HTMLSelectElement;
    const companionFilter = document.getElementById("companion-filter")! as HTMLSelectElement;

    const uniqueEras = [...new Set(episodes.map(ep => ep.era))];
    uniqueEras.forEach(era => addOptionToSelect(eraFilter, era));

    const uniqueDoctors = [...new Set(episodes.map(ep => ep.doctor.actor))];
    uniqueDoctors.forEach(doctor => addOptionToSelect(doctorFilter, doctor));

    // Correct type casting for flatMap to handle companion actor names
    const uniqueCompanions = [
        ...new Set(
            episodes.flatMap(ep => ep.companion ? [ep.companion.actor] : []) as string[]
        )
    ];
    uniqueCompanions.forEach(companion => addOptionToSelect(companionFilter, companion));
}



function addOptionToSelect(selectElement: HTMLSelectElement, value: string): void {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
}

function addSortListeners(): void {
    document.querySelectorAll(".header-cell").forEach(header => {
        header.addEventListener("click", () => {
            const sortBy = header.getAttribute("data-sort") as keyof Episode | 'castCount';
            if (sortBy) {
                toggleSortOrder(sortBy);
                applyFilters();

                updateSortIndicator(header);
            }
        });
    });
}

function toggleSortOrder(column: keyof Episode | 'castCount'): void {
    currentSortOrder = (currentSort === column && currentSortOrder === 'asc') ? 'desc' : 'asc';
    currentSort = column;
}

function updateSortIndicator(header: Element): void {
    document.querySelectorAll(".header-cell").forEach(h => {
        h.classList.remove("sorted-asc", "sorted-desc");
    });
   
    if (currentSortOrder === 'asc') {
        header.classList.add("sorted-asc");
    } else {
        header.classList.add("sorted-desc");
    }
}

function sortEpisodes(episodes: Episode[]): Episode[] {
    const sortOrder = currentSortOrder === 'asc' ? 1 : -1;

    return episodes.slice().sort((a, b) => {
        if (currentSort === 'rank' || currentSort === 'series') {
            return (a[currentSort] - b[currentSort]) * sortOrder;
        } else if (currentSort === 'era') {
            const eraOrder = { Classic: 1, Modern: 2, Recent: 3 } as const;
            const eraA = eraOrder[a.era as keyof typeof eraOrder];
            const eraB = eraOrder[b.era as keyof typeof eraOrder];
            return (eraA - eraB) * sortOrder;
        } else if (currentSort === 'doctor') {
            return a.doctor.actor.localeCompare(b.doctor.actor) * sortOrder;
        } else if (currentSort === 'companion') {
            const companionA = a.companion?.actor || '';
            const companionB = b.companion?.actor || '';
            return companionA.localeCompare(companionB) * sortOrder;
        } else if (currentSort === 'castCount') {
            return (a.cast.length - b.cast.length) * sortOrder;
        } else {
            const valueA = a[currentSort];
            const valueB = b[currentSort];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return valueA.localeCompare(valueB) * sortOrder;
            }

            return 0;
        }
    });
}


function addFilterListeners(): void {
    document.getElementById("name-filter")!.addEventListener("input", applyFilters);
    document.getElementById("era-filter")!.addEventListener("change", applyFilters);
    document.getElementById("doctor-filter")!.addEventListener("change", applyFilters);
    document.getElementById("companion-filter")!.addEventListener("change", applyFilters);
}

function applyFilters(): void {
    const nameFilter = (document.getElementById("name-filter") as HTMLInputElement).value.toLowerCase();
    const eraFilter = (document.getElementById("era-filter") as HTMLSelectElement).value;
    const doctorFilter = (document.getElementById("doctor-filter") as HTMLSelectElement).value;
    const companionFilter = (document.getElementById("companion-filter") as HTMLSelectElement).value;

    let filteredEpisodes = episodesData.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameFilter);
        const matchesEra = !eraFilter || episode.era === eraFilter;
        const matchesDoctor = !doctorFilter || episode.doctor.actor === doctorFilter;
        const matchesCompanion = !companionFilter || (episode.companion && episode.companion.actor === companionFilter);

        return matchesName && matchesEra && matchesDoctor && matchesCompanion;
    });

    filteredEpisodes = sortEpisodes(filteredEpisodes);

    displayEpisodes(filteredEpisodes);
}
