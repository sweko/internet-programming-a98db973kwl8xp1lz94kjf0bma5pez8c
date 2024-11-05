document.addEventListener('DOMContentLoaded', async () => {
    const apiUrls = [
        'data/doctor-who-episodes-01-10.json',
        'data/doctor-who-episodes-11-20.json',
        'data/doctor-who-episodes-21-30.json',
        'data/doctor-who-episodes-31-40.json',
        'data/doctor-who-episodes-41-50.json',
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json'
    ];

    let episodes = [];
    const eraIcons = {
        Classic: 'images/classic.jpg',
        Modern: 'images/modern.jpg',
        Recent: 'images/recent.jpg'
    };

    for (let url of apiUrls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            const data = await response.json();
            episodes = episodes.concat(data.episodes);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const populateFilters = () => {
        const eras = new Set(episodes.map(ep => ep.era));
        const doctors = new Set(episodes.map(ep => ep.doctor.actor));
        const companions = new Set(episodes.filter(ep => ep.companion).map(ep => ep.companion.actor));
        
        const eraFilter = document.getElementById('era-filter');
        const doctorFilter = document.getElementById('doctor-filter');
        const companionFilter = document.getElementById('companion-filter');
        
        eras.forEach(era => eraFilter.add(new Option(era, era)));
        doctors.forEach(doc => doctorFilter.add(new Option(doc, doc)));
        companions.forEach(comp => companionFilter.add(new Option(comp, comp)));
    };

    const renderEpisodes = (episodeList) => {
        const episodeContainer = document.querySelector('.episodes-list');
        episodeContainer.innerHTML = '';
        
        episodeList.forEach((episode) => {
            const row = document.createElement('div');
            row.className = 'episode-row';
            
            row.innerHTML = `
                <div class="episode-cell">${episode.rank}</div>
                <div class="episode-cell">${episode.title}</div>
                <div class="episode-cell">${episode.series}</div>
                <div class="episode-cell">
                    <img src="${eraIcons[episode.era]}" alt="${episode.era} icon" class="era-icon"> ${episode.era}
                </div>
                <div class="episode-cell">${new Date(episode.broadcast_date).getFullYear()}</div>
                <div class="episode-cell">${episode.director}</div>
                <div class="episode-cell">${episode.writer}</div>
                <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
                <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : 'N/A'}</div>
                <div class="episode-cell">${episode.cast.length}</div>
                <div class="episode-cell plot-preview">${truncateText(episode.plot, 50)}</div>
            `;
            
            episodeContainer.appendChild(row);
        });
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        const truncated = text.substr(0, text.lastIndexOf(' ', maxLength));
        return truncated + '...';
    };

    const sortEpisodes = (field, order) => {
        episodes.sort((a, b) => {
            let comparison = 0;
            if (a[field] > b[field]) comparison = 1;
            else if (a[field] < b[field]) comparison = -1;
            return order === 'asc' ? comparison : -comparison;
        });
        renderEpisodes(episodes);
    };

    const filterEpisodes = () => {
        const nameFilter = document.getElementById('name-filter').value.toLowerCase();
        const eraFilter = document.getElementById('era-filter').value;
        const doctorFilter = document.getElementById('doctor-filter').value;
        const companionFilter = document.getElementById('companion-filter').value;

        const filtered = episodes.filter(ep => {
            return (
                (!nameFilter || ep.title.toLowerCase().includes(nameFilter)) &&
                (!eraFilter || ep.era === eraFilter) &&
                (!doctorFilter || ep.doctor.actor === doctorFilter) &&
                (!companionFilter || (ep.companion && ep.companion.actor === companionFilter))
            );
        });
        
        renderEpisodes(filtered);
    };

    document.getElementById('name-filter').addEventListener('input', filterEpisodes);
    document.getElementById('era-filter').addEventListener('change', filterEpisodes);
    document.getElementById('doctor-filter').addEventListener('change', filterEpisodes);
    document.getElementById('companion-filter').addEventListener('change', filterEpisodes);

    populateFilters();
    renderEpisodes(episodes);
});
