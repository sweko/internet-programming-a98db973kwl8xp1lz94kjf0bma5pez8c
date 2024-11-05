document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application when the DOM is fully loaded
});

let episodes = [];
let sortedField = null;
let sortOrder = 1;

const fetchData = async () => {
    const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
    const data = await response.json();
    episodes = data.episodes;
    setupFilters();
    displayEpisodes();
};

const setupFilters = () => {
    const eraFilter = document.getElementById('era-filter');
    const doctorFilter = document.getElementById('doctor-filter');
    const companionFilter = document.getElementById('companion-filter');
    const eras = [...new Set(episodes.map(ep => ep.era))];
    const doctors = [...new Set(episodes.map(ep => ep.doctor.actor))];
    const companions = [...new Set(episodes.map(ep => ep.companion?.actor).filter(Boolean))];

    eras.forEach(era => eraFilter.innerHTML += `<option value="${era}">${era}</option>`);
    doctors.forEach(doc => doctorFilter.innerHTML += `<option value="${doc}">${doc}</option>`);
    companions.forEach(comp => companionFilter.innerHTML += `<option value="${comp}">${comp}</option>`);
};

const displayEpisodes = () => {
    const nameInput = document.getElementById('name-filter').value.toLowerCase();
    const eraValue = document.getElementById('era-filter').value;
    const doctorValue = document.getElementById('doctor-filter').value;
    const companionValue = document.getElementById('companion-filter').value;
    const episodeContainer = document.querySelector('.episodes-list');
    episodeContainer.innerHTML = '<div class="episodes-header">' + episodeContainer.firstElementChild.innerHTML + '</div>';

    episodes
        .filter(ep => ep.title.toLowerCase().includes(nameInput))
        .filter(ep => !eraValue || ep.era === eraValue)
        .filter(ep => !doctorValue || ep.doctor.actor === doctorValue)
        .filter(ep => !companionValue || ep.companion?.actor === companionValue)
        .sort((a, b) => {
            if (!sortedField) return 0;
            let valA = a[sortedField] || '';
            let valB = b[sortedField] || '';

            if (sortedField === 'era') valA = ['Classic', 'Modern', 'Recent'].indexOf(valA);
            if (sortedField === 'doctor' || sortedField === 'companion') valA = a[sortedField]?.actor || '';
            if (sortedField === 'cast') valA = a.cast.length;

            return valA > valB ? sortOrder : valA < valB ? -sortOrder : 0;
        })
        .forEach(ep => {
            const row = document.createElement('div');
            row.className = 'episode-row';
            row.innerHTML = `
                <div class="episode-cell">${ep.rank}</div>
                <div class="episode-cell">${ep.title}</div>
                <div class="episode-cell">${ep.series}</div>
                <div class="episode-cell">${ep.era}</div>
                <div class="episode-cell">${ep.broadcast_date.slice(0, 4)}</div>
                <div class="episode-cell">${ep.director}</div>
                <div class="episode-cell">${ep.writer}</div>
                <div class="episode-cell">${ep.doctor.actor} (${ep.doctor.incarnation})</div>
                <div class="episode-cell">${ep.companion ? ep.companion.actor + ' (' + ep.companion.character + ')' : ''}</div>
                <div class="episode-cell">${ep.cast.length}</div>
                <div class="episode-cell plot-preview">${ep.plot.length > 50 ? ep.plot.slice(0, 47) + '...' : ep.plot}</div>
            `;
            episodeContainer.appendChild(row);
        });
};


const getEraIcon = (era) => {
    const iconMap = {
        "Classic": "images/classic.jpg",
        "Modern": "images/modern.jpg",
        "Recent": "images/recent.jpg"
    };
    console.log(`Getting icon for era: ${era} -> ${iconMap[era]}`); // Debug log
    return `<img src="${iconMap[era]}" alt="${era} icon" class="era-icon">`;
};

document.querySelectorAll('.header-cell').forEach(header => {
    header.onclick = () => {
        const field = header.dataset.sort;
        if (field === sortedField) {
            sortOrder = -sortOrder;
        } else {
            sortedField = field;
            sortOrder = 1;
        }
        document.querySelectorAll('.header-cell').forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
        header.classList.add(sortOrder === 1 ? 'sorted-asc' : 'sorted-desc');
        displayEpisodes();
    };
});

document.getElementById('name-filter').oninput = displayEpisodes;
document.getElementById('era-filter').onchange = displayEpisodes;
document.getElementById('doctor-filter').onchange = displayEpisodes;
document.getElementById('companion-filter').onchange = displayEpisodes;

fetchData();


