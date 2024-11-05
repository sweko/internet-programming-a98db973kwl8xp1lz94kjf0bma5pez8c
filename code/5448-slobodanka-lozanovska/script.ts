type Episode = {
    rank: number;
    title: string;
    series: number;
    era: string;
    broadcast_date: string;
    director: string;
    writer: string;
    plot: string;
    doctor: {
      actor: string;
      incarnation: string;
    };
    companion: {
      actor: string;
      character: string;
    };
    cast: {
      actor: string;
      character: string;
    }[];
  };
  
  const data: Episode[] = [];
  
  let currentSort = "rank";
  
  const displayEpisodes = (episodes: Episode[]) => {
    const container = document.getElementById("episode-container");
    if (container) {
      container.innerHTML = "";
      for (const episode of episodes) {
        displayEpisode(episode);
      }
    } else {
      console.error("Episodes list container not found");
    }
  };
  
  const displayEpisode = (episode: Episode) => {
    const container = document.getElementById("episode-container");
    if (container) {
      const row = document.createElement("div");
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
    } else {
      console.error("Episodes list container not found");
    }
  };
  
  const makeEpisodeDataDiv = (data: string) => {
    const div = document.createElement("div");
    div.classList.add("episode-cell");
    div.textContent = data;
    return div;
  };
  
  document.addEventListener("DOMContentLoaded", async () => {
    const localData = await loadData();
    data.push(...localData);
    displayEpisodes(data);
  
    const rankSort = document.getElementById("sort-id")!;
    rankSort?.addEventListener("click", sortByRank);
  
    const nameSort = document.getElementById("sort-name")!;
    nameSort?.addEventListener("click", sortByName);
  
    const seriesSort = document.getElementById("sort-series")!;
    seriesSort?.addEventListener("click", sortBySeries);
  
    const eraSort = document.getElementById("sort-era")!;
    eraSort?.addEventListener("click", sortByEra);
  
    const broadcastSort = document.getElementById("sort-broadcast")!;
    broadcastSort?.addEventListener("click", sortByBroadcast);
  
    const directorSort = document.getElementById("sort-director")!;
    directorSort?.addEventListener("click", sortByDirector);
  
    const writerSort = document.getElementById("sort-writer")!;
    writerSort?.addEventListener("click", sortByWriter);

    const searchButton = document.getElementById("search-episodes");
    searchButton?.addEventListener("click", searchEpisodes);

    
  });
  
  const truncatePlot = (plot: string) => {
    if (plot.length > 50) {
      return plot.substring(0, 47) + "...";
    }
    return plot;
  };
  
  const sortByRank = () => {
    const rankSort = document.getElementById("sort-id")!;
  
    currentSort = "rank";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    rankSort.classList.toggle("sorted");
    rankSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.rank - second.rank;
    });
    displayEpisodes(data);
  }
  
  const sortByName = () => {
    const nameSort = document.getElementById("sort-name")!;
  
    currentSort = "name";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    nameSort.classList.toggle("sorted");
    nameSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.title.localeCompare(second.title);
    });
    displayEpisodes(data);
  }
  
  const sortBySeries = () => {
    const seriesSort = document.getElementById("sort-series")!;
  
    currentSort = "series";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    seriesSort.classList.toggle("sorted");
    seriesSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.series - second.series;
    });
    displayEpisodes(data);
  }
  
  const sortByEra = () => {
    const eraSort = document.getElementById("sort-era")!;
  
    currentSort = "era";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    eraSort.classList.toggle("sorted");
    eraSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.era.localeCompare(second.era);
    });
    displayEpisodes(data);
  }
  
  const sortByBroadcast = () => {
    const broadcastSort = document.getElementById("sort-broadcast")!;
  
    currentSort = "broadcast_date";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    broadcastSort.classList.toggle("sorted");
    broadcastSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.broadcast_date.localeCompare(second.broadcast_date);
    });
    displayEpisodes(data);
  }
  
  const sortByDirector = () => {
    const directorSort = document.getElementById("sort-director")!;
  
    currentSort = "director";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    directorSort.classList.toggle("sorted");
    directorSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.director.localeCompare(second.director);
    });
    displayEpisodes(data);
  }
  
  const sortByWriter = () => {
    const writerSort = document.getElementById("sort-writer")!;
  
    currentSort = "writer";
    const allSorters = document.getElementsByClassName("sorter");
    for (let index = 0; index < allSorters.length; index++) {
      const sorter = allSorters[index];
      sorter.classList.remove("sorted");
      sorter.classList.add("unsorted");
    }
    writerSort.classList.toggle("sorted");
    writerSort.classList.toggle("unsorted");
  
    data.sort((first: Episode, second: Episode) => {
      return first.writer.localeCompare(second.writer);
    });
    displayEpisodes(data);
  }
  
  const searchEpisodes = () => {
    const episodeSearch = document.getElementById("name-filter")! as HTMLInputElement;
    const episodeValue = episodeSearch.value.toLowerCase();

    const eraSearch = document.getElementById("era-filter")! as HTMLSelectElement;
    const eraValue = eraSearch.value;

    const filteredEpisodes = data
        .filter(episode => episode.title.toLowerCase().includes(episodeValue))
        .filter(episode => {
            const matchesName = episode.title.toLowerCase().includes(episodeValue);
            const matchesEra = !eraValue || episode.era === eraValue;
            return matchesName && matchesEra;
        });
    
    displayEpisodes(filteredEpisodes);
}

  const loadData = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json");
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      return data.episodes;
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  };