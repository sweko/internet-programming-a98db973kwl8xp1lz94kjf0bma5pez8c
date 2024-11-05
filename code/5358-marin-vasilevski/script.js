document.addEventListener('DOMContentLoaded', () => {
    let episodes = [];
    let sortedField = null;
    let sortOrder = 1;
    
    const fetchData = async () => {
        const response = await fetch('https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json');
        const data = await response.json();
        episodes = data.episodes;
        populateFilters();
        renderEpisodes();
    };
    
    const populateFilters = () => {
        const eraFilter = document.getElementById('era-filter');
        const doctorFilter = document.getElementById('doctor-filter');
        const companionFilter = document.getElementById('companion-filter');
    
        const eras = [...new Set(episodes.map(ep => ep.era))];
        const doctors = [...new Set(episodes.map(ep => ep.doctor.actor))];
        const companions = [...new Set(episodes.map(ep => ep.companion?.actor).filter(Boolean))];
    
        eras.forEach(era => eraFilter.innerHTML += `<option value="${era}">${era}</option>`);
        doctors.forEach(doctor => doctorFilter.innerHTML += `<option value="${doctor}">${doctor}</option>`);
        companions.forEach(companion => companionFilter.innerHTML += `<option value="${companion}">${companion}</option>`);
    };
    
    const renderEpisodes = () => {
        const nameFilter = document.getElementById('name-filter').value.toLowerCase();
        const eraFilter = document.getElementById('era-filter').value;
        const doctorFilter = document.getElementById('doctor-filter').value;
        const companionFilter = document.getElementById('companion-filter').value;
        const episodeList = document.querySelector('.episodes-list');
        episodeList.innerHTML = '<div class="episodes-header">' + episodeList.firstElementChild.innerHTML + '</div>';
    
        episodes
            .filter(ep => ep.title.toLowerCase().includes(nameFilter))
            .filter(ep => !eraFilter || ep.era === eraFilter)
            .filter(ep => !doctorFilter || ep.doctor.actor === doctorFilter)
            .filter(ep => !companionFilter || ep.companion?.actor === companionFilter)
            .sort((a, b) => {
                if (!sortedField) return 0;
                let valA = a[sortedField] || '';
                let valB = b[sortedField] || '';
    
                if (sortedField === 'era') {
                    valA = ['Classic', 'Modern', 'Recent'].indexOf(valA);
                }
                if (sortedField === 'doctor' || sortedField === 'companion') {
                    valA = a[sortedField]?.actor || '';
                }
                if (sortedField === 'cast') {
                    valA = a.cast.length;
                }
    
                return (valA > valB ? sortOrder : (valA < valB ? -sortOrder : 0));
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
                    <div class="episode-cell">${ep.companion ? `${ep.companion.actor} (${ep.companion.character})` : ''}</div>
                    <div class="episode-cell">${ep.cast.length}</div>
                    <div class="episode-cell plot-preview">${ep.plot.length > 50 ? ep.plot.slice(0, 47) + '...' : ep.plot}</div>
                `;
                episodeList.appendChild(row);
            });
    };
    
    document.querySelectorAll('.header-cell').forEach(header => {
        header.onclick = () => {
            const field = header.dataset.sort;
            sortOrder = field === sortedField ? -sortOrder : 1;
            sortedField = field;
            
            document.querySelectorAll('.header-cell').forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
            header.classList.add(sortOrder === 1 ? 'sorted-asc' : 'sorted-desc');
            renderEpisodes();
        };
    });
    
    document.getElementById('name-filter').oninput = renderEpisodes;
    document.getElementById('era-filter').onchange = renderEpisodes;
    document.getElementById('doctor-filter').onchange = renderEpisodes;
    document.getElementById('companion-filter').onchange = renderEpisodes;
    
    fetchData();


});
