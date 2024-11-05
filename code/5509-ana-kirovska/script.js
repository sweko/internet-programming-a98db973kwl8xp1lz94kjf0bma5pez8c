document.addEventListener('DOMContentLoaded', () => {
    const api_urls = [
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-01-10.json', 
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-11-20.json',
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-21-30.json',
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-31-40.json',
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes-41-50.json',
        'https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json'
    ];

    let episodes = [];
    let filtered_episodes = [];

    async function fetch_data() {
        let api_data = [];
        for (const url of api_urls) {
            const response = await fetch(url);
            const jsonData = await response.json();
            api_data = api_data.concat(jsonData.episodes);
        }
        return api_data;
    }

    function populate_filters(episodes) {
        const doctor_filter = document.getElementById('doctor-filter');
        const companion_filter = document.getElementById('companion-filter');
        const era_filter = document.getElementById('era-filter');

        const filteredDoctors = [...new Set(episodes.map(e => e.doctor.actor))].sort();
        filteredDoctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor;
            option.textContent = doctor;
            doctor_filter.appendChild(option);
        });

        const filteredCompanions = [...new Set(episodes.map(e => e.companion?.actor).filter(Boolean))].sort();
        filteredCompanions.forEach(companion => {
            const option = document.createElement('option');
            option.value = companion;
            option.textContent = companion;
            companion_filter.appendChild(option);
        });

        const filteredEras = ['Classic', 'Modern', 'Recent'];
        filteredEras.forEach(era => {
            const option = document.createElement('option');
            option.value = era;
            option.textContent = era;
            era_filter.appendChild(option);
        });
    }

    function display_episodes(episodes) {
        const episode_list = document.querySelector('.episodes-list');
        episode_list.innerHTML = episode_list.querySelector('.episodes-header').outerHTML;

        episodes.forEach(episode => {
            const row = document.createElement('div');
            row.className = 'episode-row';

            const plot_preview = episode.plot.length > 50 ? `${episode.plot.substring(0, 47)}...` : episode.plot;

            row.innerHTML = `
                <div class="episode-cell">${episode.rank}</div>
                <div class="episode-cell">${episode.title}</div>
                <div class="episode-cell">${episode.series}</div>
                <div class="episode-cell">${episode.era}</div>
                <div class="episode-cell">${episode.broadcast_date.split('-')[0]}</div>
                <div class="episode-cell">${episode.director}</div>
                <div class="episode-cell">${episode.writer}</div>
                <div class="episode-cell">${episode.doctor.actor} (${episode.doctor.incarnation})</div>
                <div class="episode-cell">${episode.companion ? `${episode.companion.actor} (${episode.companion.character})` : ''}</div>
                <div class="episode-cell">${episode.cast.length}</div>
                <div class="episode-cell plot-preview">${plot_preview}</div>
            `;

            episode_list.appendChild(row);
        });
    }

    function sort_table(sortKey) {
        const header_cell = document.querySelector(`.header-cell[data-sort="${sortKey}"]`);
        const is_ascending = header_cell.classList.toggle('desc') ? false : true;

        filtered_episodes.sort((a, b) => {
            let a_value = a[sortKey];
            let b_value = b[sortKey];

            if (sortKey === 'broadcast') {
                a_value = a.broadcast_date.split('-')[0];
                b_value = b.broadcast_date.split('-')[0];
            }

            if (typeof a_value === 'string') {
                a_value = a_value.toLowerCase();
                b_value = b_value.toLowerCase();
            }

            if (a_value > b_value) return is_ascending ? 1 : -1;
            if (a_value < b_value) return is_ascending ? -1 : 1;
            return 0;
        });

        display_episodes(filtered_episodes);
    }

    function apply_filters() {
        const name_filter = document.getElementById('name-filter').value.toLowerCase();
        const era_filter = document.getElementById('era-filter').value;
        const doctor_filter = document.getElementById('doctor-filter').value;
        const companion_filter = document.getElementById('companion-filter').value;

        filtered_episodes = episodes.filter(episode => {
            return (!name_filter || episode.title.toLowerCase().includes(name_filter)) &&
                   (!era_filter || episode.era === era_filter) &&
                   (!doctor_filter || episode.doctor.actor === doctor_filter) &&
                   (!companion_filter || (episode.companion && episode.companion.actor === companion_filter));
        });

        display_episodes(filtered_episodes);
    }

    async function init() {
        episodes = await fetch_data();
        filtered_episodes = episodes;

        populate_filters(episodes);
        display_episodes(episodes);
    }

    document.querySelectorAll('.header-cell').forEach(header => {
        header.addEventListener('click', () => {
            sort_table(header.dataset.sort);
        });
    });

    document.getElementById('name-filter').addEventListener('input', apply_filters);
    document.getElementById('era-filter').addEventListener('change', apply_filters);
    document.getElementById('doctor-filter').addEventListener('change', apply_filters);
    document.getElementById('companion-filter').addEventListener('change', apply_filters);

    init();
});
