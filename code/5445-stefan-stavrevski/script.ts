type Doctor = {
  actor: string;
  incarnation: string;
};

type Companion = {
  actor: string;
  character: string;
};

type CastMember = {
  actor: string;
  character: string;
};

type Episode = {
  rank: number;
  title: string;
  series: number;
  era: "Classic" | "Modern" | "Recent";
  broadcast_date: string;
  director: string;
  writer: string;
  plot: string;
  doctor: Doctor;
  companion?: Companion;
  cast: CastMember[];
};

let episodes: Episode[] = [];
let sortField: keyof Episode | "broadcast_year" | "broadcast_decade" | "cast" =
  "rank";
let sortDirection: "asc" | "desc" = "asc";

// I couldn't get it to work without this Promise<void> thing
const fetchEpisodes = async (): Promise<void> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json"
    );
    const data = await response.json();
    episodes = data.episodes;
    populateFilters(episodes);
    renderEpisodes(episodes);
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
};

fetchEpisodes();

const renderEpisodes = (episodesList: Episode[]): void => {
  const container = document.getElementById("data-container") as HTMLElement;
  container.innerHTML = "";

  episodesList.forEach((episode) => {
    const broadcastYear = new Date(episode.broadcast_date).getFullYear();
    const doctorInfo = `${episode.doctor.actor} (${episode.doctor.incarnation})`;
    const companionInfo = episode.companion
      ? `${episode.companion.actor} (${episode.companion.character})`
      : "N/A";
    const castCount = episode.cast.length;

    const row = document.createElement("div");
    row.classList.add("episode-row");

    row.innerHTML = `
      <div class="episode-cell">${episode.rank}</div>
      <div class="episode-cell">${episode.title}</div>
      <div class="episode-cell">${episode.series}</div>
      <div class="episode-cell">${episode.era}</div>
      <div class="episode-cell">${broadcastYear}</div>
      <div class="episode-cell">${episode.director}</div>
      <div class="episode-cell">${episode.writer}</div>
      <div class="episode-cell">${doctorInfo}</div>
      <div class="episode-cell">${companionInfo}</div>
      <div class="episode-cell">${castCount}</div>
      <div class="episode-cell plot-preview">${episode.plot}</div>
    `;

    container.appendChild(row);
  });
};

const sortEpisodes = (episodesList: Episode[]): Episode[] => {
  return episodesList.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "rank":
      case "title":
      case "series":
      case "director":
      case "writer":
        aValue = a[sortField];
        bValue = b[sortField];
        break;

      case "broadcast_year":
        aValue = new Date(a.broadcast_date).getFullYear();
        bValue = new Date(b.broadcast_date).getFullYear();
        break;

      case "broadcast_decade":
        aValue = Math.floor(new Date(a.broadcast_date).getFullYear() / 10);
        bValue = Math.floor(new Date(b.broadcast_date).getFullYear() / 10);
        break;

      case "era":
        const eraOrder = { Classic: 1, Modern: 2, Recent: 3 };
        aValue = eraOrder[a.era];
        bValue = eraOrder[b.era];
        break;

      case "doctor":
        aValue = a.doctor.actor;
        bValue = b.doctor.actor;
        break;

      case "companion":
        aValue = a.companion ? a.companion.actor : "";
        bValue = b.companion ? b.companion.actor : "";
        break;

      case "cast":
        aValue = [a.cast.length, a.cast[0]?.actor];
        bValue = [b.cast.length, b.cast[0]?.actor];
        break;

      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

const updateSort = (
  field: keyof Episode | "broadcast_year" | "broadcast_decade" | "cast"
) => {
  if (sortField === field) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    sortDirection = "asc";
  }
  renderEpisodes(sortEpisodes(episodes));
};

document.querySelectorAll(".header-cell").forEach((header) => {
  header.addEventListener("click", () => {
    const field = (header as HTMLElement).dataset.sort as
      | keyof Episode
      | "broadcast_year"
      | "broadcast_decade"
      | "cast";
    updateSort(field);
  });
});

const filterEpisodes = (): Episode[] => {
  const nameFilter = (
    document.getElementById("name-filter") as HTMLInputElement
  ).value.toLowerCase();
  const eraFilter = (document.getElementById("era-filter") as HTMLSelectElement)
    .value;

  return episodes.filter((episode) => {
    const matchesName = episode.title.toLowerCase().includes(nameFilter);
    const matchesEra = !eraFilter || episode.era === eraFilter;
    return matchesName && matchesEra;
  });
};

const updateFilteredEpisodes = () => {
  const filteredEpisodes = filterEpisodes();
  renderEpisodes(sortEpisodes(filteredEpisodes));
};

const populateFilters = (episodesList: Episode[]): void => {
  const eraSet = new Set(episodesList.map((episode) => episode.era));
  const eraFilter = document.getElementById("era-filter") as HTMLSelectElement;

  eraSet.forEach((era) => {
    const option = document.createElement("option");
    option.value = era;
    option.textContent = era;
    eraFilter.appendChild(option);
  });
};

document
  .getElementById("name-filter")!
  .addEventListener("input", updateFilteredEpisodes);
document
  .getElementById("era-filter")!
  .addEventListener("change", updateFilteredEpisodes);
