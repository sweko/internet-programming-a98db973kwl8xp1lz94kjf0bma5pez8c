const episodesBody = document.getElementById('episodesBody');
const nameFilter = document.getElementById('nameFilter');
const eraFilter = document.getElementById('eraFilter');
const doctorFilter = document.getElementById('doctorFilter');
const companionFilter = document.getElementById('companionFilter');

let episodes = [];

async function fetchEpisodes() {
    const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
    const data = await response.json();
    episodes = data.episodes;
    populateTable(episodes);
    populateFilters();
}

function populateTable(episodes) {
    episodesBody.innerHTML = '';
    episodes.forEach(episode => {
        const row = document.createElement('tr');
                let imageSrc;
                switch (episode.era) {
                    case "Classic":
                        imageSrc = "../../images/classic.jpg";
                        break;
                    case "Modern":
                        imageSrc = "../../images/modern.jpg";
                        break;
                    case "Recent":
                        imageSrc = "../../images/recent.jpg";
                        break;
                    default:
                        imageSrc = ""; 
                }

        row.innerHTML = `
            <td>${episode.rank}</td>
            <td>${episode.title}</td>
            <td>${episode.series}</td>
            <td>
                <img src="${imageSrc}" alt="${episode.era} era" class="era-icon" style="width:50px;height:auto;">
                ${episode.era}
            </td>
            <td>${new Date(episode.broadcast_date).getFullYear()}</td>
            <td>${episode.director}</td>
            <td>${episode.writer}</td>
            <td>${episode.doctor.actor} (${episode.doctor.incarnation})</td>
            <td>${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : 'N/A'}</td>
            <td>${episode.cast.length}</td>
            <td>${truncatePlot(episode.plot)}</td>
        `;
        episodesBody.appendChild(row);
    });
}

function truncatePlot(plot) {
    return plot.length > 50 ? plot.substring(0, plot.lastIndexOf(' ', 50)) + '...' : plot;
}

function populateFilters() {
    const doctors = new Set();
    const companions = new Set();

    episodes.forEach(episode => {
        doctors.add(episode.doctor.actor);
        if (episode.companion) {
            companions.add(episode.companion.actor);
        }
    });

    const anyDoctorOption = document.createElement('option');
    anyDoctorOption.value = '';
    anyDoctorOption.textContent = 'Any';
    doctorFilter.appendChild(anyDoctorOption);

    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorFilter.appendChild(option);
    });

    const anyCompanionOption = document.createElement('option');
    anyCompanionOption.value = '';
    anyCompanionOption.textContent = 'Any';
    companionFilter.appendChild(anyCompanionOption);

    companions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion;
        option.textContent = companion;
        companionFilter.appendChild(option);
    });
}

nameFilter.addEventListener('input', applyFilters);
eraFilter.addEventListener('change', applyFilters);
doctorFilter.addEventListener('change', applyFilters);
companionFilter.addEventListener('change', applyFilters);

function applyFilters() {
    const nameValue = nameFilter.value.toLowerCase();
    const eraValue = eraFilter.value;
    const doctorValue = doctorFilter.value;
    const companionValue = companionFilter.value;

    const filteredEpisodes = episodes.filter(episode => {
        const matchesName = episode.title.toLowerCase().includes(nameValue);
        const matchesEra = eraValue === '' || episode.era === eraValue;
        const matchesDoctor = doctorValue === '' || episode.doctor.actor === doctorValue;
        const matchesCompanion = companionValue === '' || (episode.companion && episode.companion.actor === companionValue);
        return matchesName && matchesEra && matchesDoctor && matchesCompanion;
    });

    populateTable(filteredEpisodes);
}

const headers = document.querySelectorAll('th[data-sort]');
headers.forEach(header => {
    header.addEventListener('click', () => {
        const sortBy = header.getAttribute('data-sort');
        const isAsc = header.classList.contains('asc');
        const sortedEpisodes = sortEpisodes(episodes, sortBy, !isAsc);
        headers.forEach(h => h.classList.remove('asc', 'desc'));
        header.classList.toggle('asc', !isAsc);
        header.classList.toggle('desc', isAsc);
        populateTable(sortedEpisodes);
    });
});

function sortEpisodes(episodes, sortBy, ascending) {
    return episodes.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'rank':
                aValue = a.rank;
                bValue = b.rank;
                break;
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            case 'series':
                aValue = a.series;
                bValue = b.series;
                break;
            case 'era':
                const eraOrder = { 'Classic': 1, 'Modern': 2, 'Recent': 3 };
                aValue = eraOrder[a.era];
                bValue = eraOrder[b.era];
                break;
            case 'broadcast_year':
                aValue = new Date(a.broadcast_date).getFullYear();
                bValue = new Date(b.broadcast_date).getFullYear();
                break;
            case 'director':
                aValue = a.director.toLowerCase();
                bValue = b.director.toLowerCase();
                break;
            case 'writer':
                aValue = a.writer.toLowerCase();
                bValue = b.writer.toLowerCase();
                break;
            case 'doctor':
                aValue = a.doctor.actor.toLowerCase();
                bValue = b.doctor.actor.toLowerCase();
                break;
            case 'companion':
                aValue = a.companion ? a.companion.actor.toLowerCase() : '';
                bValue = b.companion ? b.companion.actor.toLowerCase() : '';
                break;
            case 'cast_count':
                aValue = a.cast.length;
                bValue = b.cast.length;
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return ascending ? -1 : 1;
        if (aValue > bValue) return ascending ? 1 : -1;
        return 0;
    });
}

fetchEpisodes();