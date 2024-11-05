let episodes = [];
let currentSort = { field: 'rank', direction: 'asc' };
let filters = {
    name: '',
    era: '',
    doctor: '',
    companion: ''
};


async function fetchEpisodes() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
        const data = await response.json();
        episodes = data.episodes;
        initializeFilters();
        renderEpisodes();
    } catch (error) {
        console.error('Error fetching episodes:', error);
    }
}


function initializeFilters() {
    
    const eras = [...new Set(episodes.map(episode => episode.era))];
    const eraSelect = document.getElementById('era-filter');
    eras.forEach(era => {
        const option = document.createElement('option');
        option.value = era;
        option.textContent = era;
        eraSelect.appendChild(option);
    });

    
    const doctors = [...new Set(episodes.map(episode => episode.doctor.actor))];
    const doctorSelect = document.getElementById('doctor-filter');
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
    });

    
    const companions = [...new Set(episodes
        .filter(episode => episode.companion)
        .map(episode => episode.companion.actor))];
    const companionSelect = document.getElementById('companion-filter');
    companions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion;
        option.textContent = companion;
        companionSelect.appendChild(option);
    });
}


function formatCastList(cast) {
    if (!cast || cast.length === 0) return '';
    
    const sortedCast = [...cast].sort((a, b) => a.actor.localeCompare(b.actor));
    const castToShow = sortedCast.slice(0, 5);
    const castNames = castToShow.map(member => `${member.actor} (${member.character})`);
    
    if (cast.length > 5) {
        return castNames.join(', ') + '...';
    }
    
    if (castNames.length <= 2) {
        return castNames.join(' & ');
    }
    
    return castNames.slice(0, -1).join(', ') + ' & ' + castNames[castNames.length - 1];
}


function formatBroadcastYear(date) {
    return new Date(date).getFullYear();
}


function formatDecade(year) {
    return `${Math.floor(year / 10) * 10}s`;
}


function truncatePlot(plot, maxLength = 50) {
    if (!plot) return '';
    if (plot.length <= maxLength) return plot;
    
    const truncated = plot.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substr(0, lastSpace) + '...';
}


function sortEpisodes(episodes) {
    return [...episodes].sort((a, b) => {
        let valueA = a[currentSort.field];
        let valueB = b[currentSort.field];
        
        
        if (currentSort.field === 'doctor') {
            valueA = a.doctor.actor;
            valueB = b.doctor.actor;
        } else if (currentSort.field === 'companion') {
            valueA = a.companion?.actor || '';
            valueB = b.companion?.actor || '';
        } else if (currentSort.field === 'cast') {
            valueA = a.cast?.length || 0;
            valueB = b.cast?.length || 0;
        } else if (currentSort.field === 'broadcast') {
            valueA = new Date(a.broadcast_date);
            valueB = new Date(b.broadcast_date);
        }
        
        
        let comparison = 0;
        if (valueA > valueB) comparison = 1;
        if (valueA < valueB) comparison = -1;
        
        return currentSort.direction === 'asc' ? comparison : -comparison;
    });
}


function filterEpisodes(episodes) {
    return episodes.filter(episode => {
        const nameMatch = episode.title.toLowerCase().includes(filters.name.toLowerCase());
        const eraMatch = !filters.era || episode.era === filters.era;
        const doctorMatch = !filters.doctor || episode.doctor.actor === filters.doctor;
        const companionMatch = !filters.companion || episode.companion?.actor === filters.companion;
        
        return nameMatch && eraMatch && doctorMatch && companionMatch;
    });
}


function renderEpisodes() {
    const episodesList = document.querySelector('.episodes-list');
    const header = episodesList.querySelector('.episodes-header');
    
    
    Array.from(episodesList.children).forEach(child => {
        if (!child.classList.contains('episodes-header')) {
            child.remove();
        }
    });
    
    
    let displayedEpisodes = filterEpisodes(episodes);
    displayedEpisodes = sortEpisodes(displayedEpisodes);
    
    
    displayedEpisodes.forEach(episode => {
        const row = document.createElement('div');
        row.className = 'episode-row';
        
        row.innerHTML = `
            <div class="episode-cell">${episode.rank}</div>
            <div class="episode-cell">${episode.title}</div>
            <div class="episode-cell">${episode.series}</div>
            <div class="episode-cell">
                <img src="images/${episode.era.toLowerCase()}.jpg" class="era-icon" alt="${episode.era}">
                ${episode.era}
            </div>
            <div class="episode-cell">${formatBroadcastYear(episode.broadcast_date)}</div>
            <div class="episode-cell">${episode.director}</div>
            <div class="episode-cell">${episode.writer}</div>
            <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
            <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : ''}</div>
            <div class="episode-cell">${episode.cast?.length || 0}</div>
            <div class="episode-cell plot-preview">${truncatePlot(episode.plot)}</div>
        `;
        
        episodesList.appendChild(row);
    });
    
    
    header.querySelectorAll('.header-cell').forEach(cell => {
        cell.classList.remove('sorted-asc', 'sorted-desc');
        if (cell.dataset.sort === currentSort.field) {
            cell.classList.add(`sorted-${currentSort.direction}`);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    
    fetchEpisodes();
    
    
    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener('click', () => {
            const field = header.dataset.sort;
            if (currentSort.field === field) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.field = field;
                currentSort.direction = 'asc';
            }
            renderEpisodes();
        });
    });
    
    
    document.getElementById('name-filter').addEventListener('input', (e) => {
        filters.name = e.target.value;
        renderEpisodes();
    });
    
    document.getElementById('era-filter').addEventListener('change', (e) => {
        filters.era = e.target.value;
        renderEpisodes();
    });
    
    document.getElementById('doctor-filter').addEventListener('change', (e) => {
        filters.doctor = e.target.value;
        renderEpisodes();
    });
    
    document.getElementById('companion-filter').addEventListener('change', (e) => {
        filters.companion = e.target.value;
        renderEpisodes();
    });
});
 


