const apiUrl = 'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json';
const episodeFileNames = [
  'doctor-who-episodes-01-10.json',
  'doctor-who-episodes-11-20.json',
  'doctor-who-episodes-21-30.json',
  'doctor-who-episodes-31-40.json',
  'doctor-who-episodes-41-50.json'
];

let episodes = [];
let filteredEpisodes = [];
let currentSort = { column: null, order: 'asc' };

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  setupFilters();
  setupSorting();
});

function fetchData() {
  const promises = episodeFileNames.map(fileName => {
    return fetch(`data/${fileName}`).then(response => response.json());
  });

  Promise.all(promises)
    .then(dataArray => {
      dataArray.forEach(data => {
        episodes = episodes.concat(data.episodes);
      });
      populateFilters();
      applyFilters();
    })
    .catch(error => console.error('Error fetching data:', error));
}

function populateFilters() {
  const eraSet = new Set();
  const doctorSet = new Set();
  const companionSet = new Set();

  episodes.forEach(ep => {
    eraSet.add(ep.era);
    doctorSet.add(ep.doctor.actor);
    if (ep.companion) {
      companionSet.add(ep.companion.actor);
    }
  });

  const eraFilter = document.getElementById('eraFilter');
  eraSet.forEach(era => {
    const option = document.createElement('option');
    option.value = era;
    option.textContent = era;
    eraFilter.appendChild(option);
  });

  const doctorFilter = document.getElementById('doctorFilter');
  doctorSet.forEach(doctor => {
    const option = document.createElement('option');
    option.value = doctor;
    option.textContent = doctor;
    doctorFilter.appendChild(option);
  });

  const companionFilter = document.getElementById('companionFilter');
  companionSet.forEach(companion => {
    const option = document.createElement('option');
    option.value = companion;
    option.textContent = companion;
    companionFilter.appendChild(option);
  });
}

function setupFilters() {
  document.getElementById('nameFilter').addEventListener('input', applyFilters);
  document.getElementById('eraFilter').addEventListener('change', applyFilters);
  document.getElementById('doctorFilter').addEventListener('change', applyFilters);
  document.getElementById('companionFilter').addEventListener('change', applyFilters);
}

function applyFilters() {
  const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
  const eraFilter = document.getElementById('eraFilter').value;
  const doctorFilter = document.getElementById('doctorFilter').value;
  const companionFilter = document.getElementById('companionFilter').value;

  filteredEpisodes = episodes.filter(ep => {
    const matchesName = ep.title.toLowerCase().includes(nameFilter);
    const matchesEra = eraFilter === '' || ep.era === eraFilter;
    const matchesDoctor = doctorFilter === '' || ep.doctor.actor === doctorFilter;
    const matchesCompanion = companionFilter === '' || (ep.companion && ep.companion.actor === companionFilter);
    return matchesName && matchesEra && matchesDoctor && matchesCompanion;
  });

  renderTable();
}

function setupSorting() {
  const headers = document.querySelectorAll('#episodesTable th');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-sort');
      sortTable(column);
    });
  });
}

function sortTable(column) {
  if (currentSort.column === column) {
    currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.order = 'asc';
  }

  filteredEpisodes.sort((a, b) => {
    let valueA = getColumnValue(a, column);
    let valueB = getColumnValue(b, column);

    if (column === 'era') {
      const eraOrder = { 'Classic': 1, 'Modern': 2, 'Recent': 3 };
      valueA = eraOrder[valueA];
      valueB = eraOrder[valueB];
    }

    if (currentSort.order === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  renderTable();
  updateSortIndicators();
}

function getColumnValue(episode, column) {
  switch (column) {
    case 'rank':
      return Number(episode.rank);
    case 'title':
      return episode.title.toLowerCase();
    case 'series':
      return Number(episode.series);
    case 'era':
            return episode.era;
        case 'eraIcon':
            return episode.era;
        case 'broadcastYear':
            return new Date(episode.broadcast_date).getFullYear();
        case 'broadcastDecade':
            return Math.floor(new Date(episode.broadcast_date).getFullYear() / 10) * 10;
        case 'director':
            return episode.director.toLowerCase();
        case 'writer':
            return episode.writer.toLowerCase();
        case 'doctor':
            return episode.doctor.actor.toLowerCase();
        case 'companion':
            return episode.companion ? episode.companion.actor.toLowerCase() : '';
        case 'castCount':
            return episode.cast.length;
        case 'castMembers':
            return episode.cast.map(c => c.actor.toLowerCase()).join(', ');
        case 'plot':
            return episode.plot.toLowerCase();
        default:
            return '';
    }
}

function updateSortIndicators() {
    const headers = document.querySelectorAll('#episodesTable th');
    headers.forEach(header => {
        header.classList.remove('sorted-asc', 'sorted-desc');
        if (header.getAttribute('data-sort') === currentSort.column) {
            header.classList.add(currentSort.order === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}

function renderTable() {
    const tbody = document.querySelector('#episodesTable tbody');
    tbody.innerHTML = '';

    filteredEpisodes.forEach(ep => {
        const tr = document.createElement('tr');
        const rankTd = document.createElement('td');
        rankTd.textContent = ep.rank;
        tr.appendChild(rankTd);

        const nameTd = document.createElement('td');
        nameTd.textContent = ep.title;
        tr.appendChild(nameTd);

        const seriesTd = document.createElement('td');
        seriesTd.textContent = ep.series;
        tr.appendChild(seriesTd);

   
        const eraTd = document.createElement('td');
        eraTd.textContent = ep.era;
        tr.appendChild(eraTd);

        const eraIconTd = document.createElement('td');
        const img = document.createElement('img');
        img.src = `images/${ep.era.toLowerCase()}.jpg`;

        img.alt = ep.era;
        eraIconTd.appendChild(img);
        tr.appendChild(eraIconTd);

        const broadcastYearTd = document.createElement('td');
        broadcastYearTd.textContent = new Date(ep.broadcast_date).getFullYear();
        tr.appendChild(broadcastYearTd);

        const broadcastDecadeTd = document.createElement('td');
        const year = new Date(ep.broadcast_date).getFullYear();
        const decade = Math.floor(year / 10) * 10;
        broadcastDecadeTd.textContent = `${decade}s`;
        tr.appendChild(broadcastDecadeTd);

        const directorTd = document.createElement('td');
        directorTd.textContent = ep.director;
        tr.appendChild(directorTd);

        const writerTd = document.createElement('td');
        writerTd.textContent = ep.writer;
        tr.appendChild(writerTd);

        const doctorTd = document.createElement('td');
        doctorTd.textContent = `${ep.doctor.actor} (${ep.doctor.incarnation})`;
        tr.appendChild(doctorTd);

        const companionTd = document.createElement('td');
        if (ep.companion) {
            companionTd.textContent = `${ep.companion.actor} (${ep.companion.character})`;
        } else {
            companionTd.textContent = 'N/A';
        }
        tr.appendChild(companionTd);

        const castCountTd = document.createElement('td');
        castCountTd.textContent = ep.cast.length;
        tr.appendChild(castCountTd);

        const castMembersTd = document.createElement('td');
        const sortedCast = ep.cast.map(c => c.actor).sort();
        let castList = '';
        if (sortedCast.length > 5) {
            castList = sortedCast.slice(0, 5).join(', ') + ', ...';
        } else if (sortedCast.length < 3) {
            castList = sortedCast.join(', ');
        } else {
            castList = sortedCast.slice(0, -1).join(', ') + ' & ' + sortedCast.slice(-1);
        }
        castMembersTd.textContent = castList;
        tr.appendChild(castMembersTd);


        const plotTd = document.createElement('td');
        const plot = ep.plot.length > 50 ? ep.plot.substr(0, ep.plot.lastIndexOf(' ', 50)) + '...' : ep.plot;
        plotTd.textContent = plot;
        plotTd.addEventListener('click', () => {
          const plotModal = document.getElementById('plot-modal');
          const plotText = document.getElementById('plot-text');
          plotText.textContent = ep.plot;
          plotModal.style.display = 'block';
        });
        tr.appendChild(plotTd);
        const closeButton = document.querySelector('.close');
        closeButton.addEventListener('click', () => {
          const plotModal = document.getElementById('plot-modal');
          plotModal.style.display = 'none';
        });
        
        tbody.appendChild(tr);
    });
}


