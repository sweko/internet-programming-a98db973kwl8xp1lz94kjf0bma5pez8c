type CastMember = {
  actor: string;
  character: number;
};
type Doctor = {
  actor: string;
  incarnation: string;
};
type CompanionMember = {
  actor: string;
  character?: string;
};
type Episode = {
  rank: number;
  title: string;
  series: number;
  era: string;
  broadcast_date: string;
  director: string;
  doctor: Doctor;
  companion: CompanionMember;
  writer: string;
  plot: string;
  cast: CastMember[];
  rating: number;
};

const data: Episode[] = [];

const getEpisodes = async () => {
  const response = await fetch(
    "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json"
  );
  const data = await response.json();
  console.log(data);
  return data.episodes;
};
const showEpisodes = (episodes: Episode[]) => {
  const container = document.getElementById("episodes-container")!;
  container.innerHTML = "";
  for (const episode of episodes) {
    showEpisode(episode);
  }
};
const showEpisode = (episode: Episode) => {
  const container = document.getElementById("episodes-container");
  const row = document.createElement("div");
  row.classList.add("episode-row");
  row.appendChild(makeEpisodeDataDiv(episode.rank.toString()));
  row.appendChild(makeEpisodeDataDiv(episode.title));
  row.appendChild(makeEpisodeDataDiv(episode.series.toString()));
  row.appendChild(makeEpisodeDataDiv(episode.era));
  row.appendChild(makeEpisodeDataDiv(getBroadcastYear(episode).toString()));
  row.appendChild(makeEpisodeDataDiv(`${getBroadcastDecade(episode)}s`));
  row.appendChild(makeEpisodeDataDiv(episode.director));
  row.appendChild(makeEpisodeDataDiv(episode.writer));
  row.appendChild(makeEpisodeDataDiv(getDoctor(episode)));
  row.appendChild(makeEpisodeDataDiv(getCompanion(episode)));

  const castCell = document.createElement("div");
  castCell.classList.add("episode-cell");
  castCell.appendChild(displayCastMembers(episode));
  row.appendChild(castCell);

  row.appendChild(makeEpisodeDataDiv(episode.plot));

  container?.appendChild(row);
};
const makeEpisodeDataDiv = (data: string) => {
  const div = document.createElement("div");
  div.classList.add("episode-cell");
  div.textContent = data;
  return div;
};
const getBroadcastYear = (episode: Episode) => {
  const broadcastDate = new Date(episode.broadcast_date);
  return broadcastDate.getFullYear();
};
const getDoctor = (episode: Episode) => {
  const doctor = episode.doctor;
  const actor = doctor.actor;
  const incarnation = doctor.incarnation;
  return `${actor} (${incarnation})`;
};
const getCompanion = (episode: Episode) => {
  const companion = episode.companion;
  const actor = companion.actor;
  const character = companion.character;
  if (character !== undefined) return `${actor} (${character})`;
  return `${actor}`;
};
const getBroadcastDecade = (episode: Episode) => {
    const broadcastDate = new Date(episode.broadcast_date);
    const year = broadcastDate.getFullYear();
    const decade = year-year%10
    return decade;
  };
const displayCastMembers = (episode: Episode) => {
  const cast = episode.cast;
  cast.sort((a, b) => a.actor.localeCompare(b.actor));

  const list = document.createElement("ul");
  for (const member of cast) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${member.actor}</strong> (${member.character})`;
    list.appendChild(li);
  }
  return list;
};

const extractEras = (episodes: Episode[]) => {
  const allEras = episodes.map((episode) => episode.era);
  const unique = allEras.filter(
    (value, index, self) => self.indexOf(value) === index
  );
  return unique;
};

const displayEras = (eras: string[]) => {
    const select = document.getElementById("era-filter")! as HTMLSelectElement;
    select.innerHTML = "";
    const none = document.createElement("option");
    none.text = "--- Select ---";
    none.value = "";
    select.appendChild(none);
    for (const era of eras) {
      const option = document.createElement("option");
      option.text = era;
      option.value = era;
      select.appendChild(option);
    }
  };

const extractDoctors = (episodes: Episode[]) => {
    const allDoctors = episodes.map((episode) => episode.doctor.actor);
    const unique = allDoctors.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    return unique;
  };

const displayDoctors = (doctors: string[]) => {
  const select = document.getElementById("doctor-filter")! as HTMLSelectElement;
  select.innerHTML = "";
  const none = document.createElement("option");
  none.text = "--- Select ---";
  none.value = "";
  select.appendChild(none);
  for (const doctor of doctors) {
    const option = document.createElement("option");
    option.text = doctor;
    option.value = doctor;
    select.appendChild(option);
  }
};

const extractCompanions = (episodes: Episode[]) => {
    const allCompanions = episodes.map((episode) => episode.companion.actor);
    const unique = allCompanions.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    return unique;
  };

const displayCompanions = (companions: string[]) => {
  const select = document.getElementById("companion-filter")! as HTMLSelectElement;
  select.innerHTML = "";
  const none = document.createElement("option");
  none.text = "--- Select ---";
  none.value = "";
  select.appendChild(none);
  for (const companion of companions) {
    const option = document.createElement("option");
    option.text = companion;
    option.value = companion;
    select.appendChild(option);
  }
};


const searchEpisodes = () => {
  const nameSearch = document.getElementById(
    "name-filter"
  )! as HTMLInputElement;
  const nameValue = nameSearch.value.toLowerCase();

  const eraSearch = document.getElementById("era-filter")! as HTMLSelectElement;
  const eraValue = eraSearch.value;

  const doctorSearch = document.getElementById("doctor-filter")! as HTMLSelectElement;
  const doctorValue = doctorSearch.value;

  const companionSearch = document.getElementById("companion-filter")! as HTMLSelectElement;
  const companionValue = companionSearch.value;

  const filteredEpisodes = data
    .filter((episode) => episode.title.toLowerCase().includes(nameValue))
    .filter((episode) => {
      if (eraValue === "") {
        return true;
      }
      return eraValue === episode.era;
    })
    .filter((episode) => {
        if (doctorValue === "") {
          return true;
        }
        return doctorValue === episode.doctor.actor;
      })
      .filter((episode) => {
        if (companionValue === "") {
          return true;
        }
        return companionValue === episode.companion.actor;
      });

  showEpisodes(filteredEpisodes);
};

let currentSort = { field: "rank", direction: true };

const sortByField = (field: keyof Episode | 'broadcast_decade') => {
  if (currentSort.field === field) {
    currentSort.direction = !currentSort.direction;
  } else {
    currentSort.field = field;
    currentSort.direction = true;
  }

  const allSorters = document.getElementsByClassName("sorter");
  for (let index = 0; index < allSorters.length; index++) {
    const sorter = allSorters[index];
    sorter.classList.remove("sorted");
    sorter.classList.add("unsorted");
    sorter.innerHTML = '<i class="fa fa-sort"></i>';
  }

  const currentSorter = document.getElementById(`sort-${currentSort.field}`)!;
  currentSorter.classList.toggle("sorted", currentSort.direction);
  currentSorter.classList.toggle("unsorted", !currentSort.direction);

  currentSorter.innerHTML = currentSort.direction
    ? '<i class="fa fa-sort-up"></i>'
    : '<i class="fa fa-sort-down"></i>';

  const sortDirection = currentSort.direction ? 1 : -1;
  //1 asc -1 desc 
  data.sort((first: Episode, second: Episode) => {
    let firstValue: any;
    let secondValue: any;

    if (field === "cast") {
      const castCountComparison = first.cast.length - second.cast.length;
      if (castCountComparison !== 0) {
        return castCountComparison * sortDirection;
      }

      const firstSortedCast = first.cast.map((member) => member.actor).sort();
      const secondSortedCast = second.cast.map((member) => member.actor).sort();

      for (
        let i = 0;
        i < Math.min(firstSortedCast.length, secondSortedCast.length);
        i++
      ) {
        const comparison = firstSortedCast[i].localeCompare(
          secondSortedCast[i]
        );
        if (comparison !== 0) {
          return comparison * sortDirection;
        }
      }

      return (firstSortedCast.length - secondSortedCast.length) * sortDirection;
    } else if (field === "doctor") {
      firstValue = first.doctor.actor;
      secondValue = second.doctor.actor;
    } else if (field === "companion") {
      firstValue = first.companion.actor;
      secondValue = second.companion.actor;
    }
    else if (field === "broadcast_decade") {
        firstValue = getBroadcastDecade(first);
        secondValue = getBroadcastDecade(second);
      } 
    else {
      if (
        typeof first[field] === "string" &&
        typeof second[field] === "string"
      ) {
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

const sortByRank = () => sortByField("rank");
const sortByTitle = () => sortByField("title");
const sortBySeries = () => sortByField("series");
const sortByDirector = () => sortByField("director");
const sortByWriter = () => sortByField("writer");
const sortByPlot = () => sortByField("plot");
const sortByCast = () => sortByField("cast");
const sortByEra = () => sortByField("era");
const sortByDoctor = () => sortByField("doctor");
const sortByCompanion = () => sortByField("companion");
const sortByBroadcastYear = () => sortByField("broadcast_date");
const sortByBroadcastDecade = () => sortByField("broadcast_decade");

document.addEventListener("DOMContentLoaded", async () => {
  const loadData = await getEpisodes();
  data.push(...loadData);
  showEpisodes(data);

  const eras = extractEras(data);
  displayEras(eras);

  const doctors = extractDoctors(data);
  displayDoctors(doctors);

  const companions = extractCompanions(data);
  displayCompanions(companions);

  const rankSort = document.getElementById("sort-rank")!;
  rankSort.style.cursor = "pointer";
  rankSort?.addEventListener("click", sortByRank);

  const titleSort = document.getElementById("sort-title")!;
  titleSort.style.cursor = "pointer";
  titleSort?.addEventListener("click", sortByTitle);

  const seriesSort = document.getElementById("sort-series")!;
  seriesSort.style.cursor = "pointer";
  seriesSort?.addEventListener("click", sortBySeries);

  const directorSort = document.getElementById("sort-director")!;
  directorSort.style.cursor = "pointer";
  directorSort?.addEventListener("click", sortByDirector);

  const writerSort = document.getElementById("sort-writer")!;
  writerSort.style.cursor = "pointer";
  writerSort?.addEventListener("click", sortByWriter);

  const plotSort = document.getElementById("sort-plot")!;
  plotSort.style.cursor = "pointer";
  plotSort?.addEventListener("click", sortByPlot);

  const castSort = document.getElementById("sort-cast")!;
  castSort.style.cursor = "pointer";
  castSort?.addEventListener("click", sortByCast);

  const eraSort = document.getElementById("sort-era")!;
  eraSort.style.cursor = "pointer";
  eraSort?.addEventListener("click", sortByEra);

  const yearSort = document.getElementById("sort-broadcast_date")!;
  yearSort.style.cursor = "pointer";
  yearSort?.addEventListener("click", sortByBroadcastYear);

  const doctorSort = document.getElementById("sort-doctor")!;
  doctorSort.style.cursor = "pointer";
  doctorSort?.addEventListener("click", sortByDoctor);

  const companionSort = document.getElementById("sort-companion")!;
  companionSort.style.cursor = "pointer";
  companionSort?.addEventListener("click", sortByCompanion);

  const decadeSort = document.getElementById("sort-broadcast_decade")!;
  decadeSort.style.cursor = "pointer";
  decadeSort?.addEventListener("click", sortByBroadcastDecade);

  const searchButton = document.getElementById("search-episodes");
  searchButton?.addEventListener("click", searchEpisodes);
});
