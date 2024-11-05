fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json')
  .then(response => response.json())
  .then(data => {
    const episodes = data.episodes;
    populateFilters(episodes);
    renderEpisodeList(episodes);
    addSortingAndFilteringListeners(episodes);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

function populateFilters(episodes) {
  const eraFilter = document.getElementById('era-filter');
  const doctorFilter = document.getElementById('doctor-filter');
  const companionFilter = document.getElementById('companion-filter');

  const eras = [...new Set(episodes.map(episode => episode.era))];
  eras.forEach(era => {
    const option = document.createElement('option');
    option.value = era;
    option.textContent = era;
    eraFilter.appendChild(option);
  });

  const doctors = [...new Set(episodes.map(episode => episode.doctor.actor))];
  doctors.forEach(doctor => {
    const option = document.createElement('option');
    option.value = doctor;
    option.textContent = doctor;
    doctorFilter.appendChild(option);
  });

  const companions = [...new Set(episodes.flatMap(episode => episode.companion?.actor || []))];
  companions.forEach(companion => {
    const option = document.createElement('option');
    option.value = companion;
    option.textContent = companion;
    companionFilter.appendChild(option);
  });
}

function renderEpisodeList(episodes) {
  const episodesContainer = document.querySelector('.episodes-list');
  episodesContainer.innerHTML = '';

  const headerRow = createHeaderRow();
  episodesContainer.appendChild(headerRow);

  episodes.forEach(episode => {
    const episodeRow = createEpisodeRow(episode);
    episodesContainer.appendChild(episodeRow);
  });
}

function createHeaderRow() {
  const headerRow = document.createElement('div');
  headerRow.classList.add('episodes-header');

  const headerCells = [
    { label: 'Rank', sortKey: 'rank' },
    { label: 'Name', sortKey: 'name' },
    { label: 'Series', sortKey: 'series' },
    { label: 'Era', sortKey: 'era' },
    { label: 'Broadcast Year', sortKey: 'broadcast' },
    { label: 'Director', sortKey: 'director' },
    { label: 'Writer', sortKey: 'writer' },
    { label: 'Doctor', sortKey: 'doctor' },
    { label: 'Companion', sortKey: 'companion' },
    { label: 'Cast', sortKey: 'cast' },
    { label: 'Plot', sortKey: 'plot' }
  ];

  headerCells.forEach(cell => {
    const headerCell = document.createElement('div');
    headerCell.classList.add('header-cell');
    headerCell.dataset.sort = cell.sortKey;
    headerCell.textContent = cell.label;
    headerRow.appendChild(headerCell);
  });

  return headerRow;
}

function createEpisodeRow(episode) {
  const episodeRow = document.createElement('div');
  episodeRow.classList.add('episode-row');

  const episodeCells = [
    episode.rank,
    episode.title,
    episode.series,
    getEraIcon(episode.era) + episode.era,
    episode.broadcast_date.slice(0, 4),
    episode.director,
    episode.writer,
    `${episode.doctor.actor} (${episode.doctor.incarnation})`,
    episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : '',
    episode.cast.length,
    episode.plot.slice(0, 50) + (episode.plot.length > 50 ? '...' : '')
  ];

  episodeCells.forEach(cell => {
    const episodeCell = document.createElement('div');
    episodeCell.classList.add('episode-cell');
    episodeCell.textContent = cell;
    episodeRow.appendChild(episodeCell);
  });

  return episodeRow;
}

function getEraIcon(era) {
  switch (era) {
    case 'Classic':
      return '<img src="images/classic.jpg" alt="Classic" class="era-icon">';
    case 'Modern':
      return '<img src="images/modern.jpg" alt="Modern" class="era-icon">';
    case 'Recent':
      return '<img src="images/recent.jpg" alt="Recent" class="era-icon">';
    default:
      return '';
  }
}

function addSortingAndFilteringListeners(episodes) {
  const headerCells = document.querySelectorAll('.header-cell');
  const nameFilter = document.getElementById('name-filter');
  const eraFilter = document.getElementById('era-filter');
  const doctorFilter = document.getElementById('doctor-filter');
  const companionFilter = document.getElementById('companion-filter');

  headerCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const sortKey = cell.dataset.sort;
      sortEpisodes(episodes, sortKey);
      renderEpisodeList(filteredEpisodes(episodes));
      updateSortIndicators(cell);
    });
  });

  nameFilter.addEventListener('input', () => {
    renderEpisodeList(filteredEpisodes(episodes));
  });

  eraFilter.addEventListener('change', () => {
    renderEpisodeList(filteredEpisodes(episodes));
  });

  doctorFilter.addEventListener('change', () => {
    renderEpisodeList(filteredEpisodes(episodes));
  });

  companionFilter.addEventListener('change', () => {
    renderEpisodeList(filteredEpisodes(episodes));
  });
}

function sortEpisodes(episodes, sortKey) {
  episodes.sort((a, b) => {
    const valueA = getSortValue(a, sortKey);
    const valueB = getSortValue(b, sortKey);

    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  });
}

function getSortValue(episode, sortKey) {
  switch (sortKey) {
    case 'rank':
      return episode.rank;
    case 'name':
      return episode.title.toLowerCase();
    case 'series':
      return episode.series;
    case 'era':
      return ['Classic', 'Modern', 'Recent'].indexOf(episode.era);
    case 'broadcast':
      return episode.broadcast_date.slice(0, 4);
    case 'director':
      return episode.director.toLowerCase();
    case 'writer':
      return episode.writer.toLowerCase();
    case 'doctor':
      return episode.doctor.actor.toLowerCase();
    case 'companion':
      return episode.companion?.actor.toLowerCase() || '';
    case 'cast':
      return episode.cast.length;
    case 'plot':
      return episode.plot.toLowerCase();
    default:
      return '';
  }
}

function filteredEpisodes(episodes) {
  const nameFilter = document.getElementById('name-filter').value.toLowerCase();
  const eraFilter = document.getElementById('era-filter').value;
  const doctorFilter = document.getElementById('doctor-filter').value;
  const companionFilter = document.getElementById('companion-filter').value;

  return episodes.filter(episode => {
    const nameMatch = episode.title.toLowerCase().includes(nameFilter);
    const eraMatch = eraFilter ? episode.era === eraFilter : true;
    const doctorMatch = doctorFilter ? episode.doctor.actor === doctorFilter : true;
    const companionMatch = companionFilter ? episode.companion?.actor === companionFilter : true;

    return nameMatch && eraMatch && doctorMatch && companionMatch;
  });
}

function updateSortIndicators(sortedCell) {
  const headerCells = document.querySelectorAll('.header-cell');
  headerCells.forEach(cell => {
    cell.classList.remove('sorted-asc', 'sorted-desc');
  });

  if (sortedCell.classList.contains('sorted-asc')) {
    sortedCell.classList.remove('sorted-asc');
    sortedCell.classList.add('sorted-desc');
  } else {
    sortedCell.classList.add('sorted-asc');
  }
}