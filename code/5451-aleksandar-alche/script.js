"use strict";
const getdata = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json"
  );
  const data = await res.json();
  return data.episodes;
};
const displayEpisodes = (episodes) => {
  const container = document.querySelector(".episodes-list");
  const episodeRows = document.querySelector(".episodes-header");
  container.innerHTML = "";
  container.appendChild(episodeRows);

  episodes.forEach((episode) => {
    const row = document.createElement("div");
    row.classList.add("episode-row");

    row.appendChild(createEpisodeCell(episode.rank));
    row.appendChild(createEpisodeCell(episode.title));
    row.appendChild(createEpisodeCell(episode.series));
    row.appendChild(createEraCell(episode.era));
    row.appendChild(
      createEpisodeCell(new Date(episode.broadcast_date).getFullYear())
    );
    row.appendChild(createEpisodeCell(episode.director));
    row.appendChild(createEpisodeCell(episode.writer));
    row.appendChild(
      createEpisodeCell(
        `${episode.doctor.actor} (${episode.doctor.incarnation})`
      )
    );
    row.appendChild(
      createEpisodeCell(
        `${episode.companion.actor} (${episode.companion.character})`
      )
    );
    let castData = episode.cast
      ? episode.cast
          .map((cast) => `${cast.actor} (${cast.character})`)
          .join(", ")
      : "No cast data available";
    row.appendChild(createEpisodeCell(castData));

    row.appendChild(createEpisodeCell(episode.plot));

    container.appendChild(row);
  });
};
const createEpisodeCell = (data) => {
  const cell = document.createElement("div");
  cell.classList.add("episode-cell");
  cell.textContent = data;
  return cell;
};
const createEraCell = (era) => {
  const cell = document.createElement("div");
  cell.classList.add("episode-cell");
  const eraIcon = document.createElement("img");
  eraIcon.classList.add("era-icon");
  eraIcon.src = getEraIcon(era);
  cell.appendChild(eraIcon);
  return cell;
};
const getEraIcon = (era) => {
  switch (era.toLowerCase()) {
    case "classic":
      return "images/classic.jpg";
    case "modern":
      return "images/modern.jpg";
    case "recent":
      return "images/recent.jpg";
  }
};
const sortEpisodes = (episodes, sortBy) => {
  return episodes.sort((a, b) => {
    if (typeof a[sortBy] === "string") {
      return a[sortBy].localeCompare(b[sortBy]);
    } else {
      return a[sortBy] - b[sortBy];
    }
  });
};
const addSortListeners = (episodes) => {
  const headerCells = document.querySelectorAll(
    ".episodes-header .header-cell"
  );

  headerCells.forEach((headerCell) => {
    headerCell.addEventListener("click", () => {
      const sortBy = headerCell.dataset.sort;
      const sortedEpisodes = sortEpisodes(episodes, sortBy);
      displayEpisodes(sortedEpisodes);
    });
  });
};
const addFilterListeners = (episodes) => {
  const nameFilter = document.querySelector("#nameFilter");
  const rankFilter = document.querySelector("#rankFilter");

  const applyFilters = () => {
    const nameValue = nameFilter.value.toLowerCase();
    const rankValue = rankFilter.value;

    const filteredEpisodes = episodes.filter((episode) => {
      const matchesName = episode.title.toLowerCase().includes(nameValue);
      const matchesRank = rankValue
        ? episode.rank === parseInt(rankValue)
        : true;
      return matchesName && matchesRank;
    });

    displayEpisodes(filteredEpisodes);
  };

  nameFilter.addEventListener("input", applyFilters);
  rankFilter.addEventListener("input", applyFilters);
};

document.addEventListener("DOMContentLoaded", async () => {
  const episodes = await getdata();
  addFilterListeners(episodes);
  displayEpisodes(episodes);
  addSortListeners(episodes);
});
