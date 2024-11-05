const episodes = [ 
    { rank: 1, name: "Rose", series: 1, era: "Modern", broadcastYear: 2005, director: "Keith Boak", writer: "Russell T Davies", doctor: "Christopher Eccleston (9th Doctor)", companion: "Billie Piper (Rose Tyler)", castCount: 5, plot: "A shop girl meets a mysterious stranger." }, 
    { rank: 2, name: "The End of the World", series: 1, era: "Modern", broadcastYear: 2005, director: "Euros Lyn", writer: "Russell T Davies", doctor: "Christopher Eccleston (9th Doctor)", companion: "Billie Piper (Rose Tyler)", castCount: 6, plot: "The Doctor takes Rose to the future." },
    { rank: 3, name: "The Unquiet Dead", series: 1, era: "Modern", broadcastYear: 2005, director: "Euros Lyn", writer: "Mark Gatiss", doctor: "Christopher Eccleston (9th Doctor)", companion: "Billie Piper (Rose Tyler)", castCount: 7, plot: "The Doctor and Rose meet Charles Dickens." },
    { rank: 4, name: "Aliens of London", series: 1, era: "Modern", broadcastYear: 2005, director: "Keith Boak", writer: "Russell T Davies", doctor: "Christopher Eccleston (9th Doctor)", companion: "Billie Piper (Rose Tyler)", castCount: 8, plot: "The Doctor returns Rose to London." },
    { rank: 5, name: "World War Three", series: 1, era: "Modern", broadcastYear: 2005, director: "Keith Boak", writer: "Russell T Davies", doctor: "Christopher Eccleston (9th Doctor)", companion: "Billie Piper (Rose Tyler)", castCount: 8, plot: "The Doctor must stop an alien invasion." },
    { rank: 6, name: "Dalek", series: 1, era: "Modern", broadcastYear: 2005, director:"David Evans", writer:"Robert Shearman", doctor:"Christopher Eccleston (9th Doctor)", companion:"Billie Piper (Rose Tyler)", castCount:"6", plot:"The Doctor encounters a Dalek." },
    { rank: 7, name:"The Long Game", series:"1", era:"Modern", broadcastYear:"2005", director:"Brian Grant", writer:"Russell T Davies and others", doctor:"Christopher Eccleston (9th Doctor)", companion:"Billie Piper (Rose Tyler)", castCount:"6", plot:"The Doctor and Rose travel to the future." },
    { rank :8 , name : 'Father\'s Day', series : '1', era : 'Modern', broadcastYear : '2006', director : 'Joe Ahearne', writer : 'Paul Cornell', doctor : 'David Tennant (10th Doctor)', companion : 'Billie Piper (Rose Tyler)', castCount : '7', plot : 'Rose tries to save her father.' },
    { rank :9 , name : 'The Empty Child', series : '1', era : 'Modern', broadcastYear : '2006', director : 'James Hawes', writer : 'Steven Moffat', doctor : 'David Tennant (10th Doctor)', companion : 'Billie Piper (Rose Tyler)', castCount : '8', plot : 'A child in wartime London.' },
    { rank :10 , name : 'The Parting of the Ways', series : '1', era : 'Modern', broadcastYear : '2005', director : 'Joe Ahearne', writer : 'Russell T Davies', doctor : 'Christopher Eccleston (9th Doctor)', companion : 'Billie Piper (Rose Tyler)', castCount : '8', plot : 'The Ninth Doctor faces his greatest challenge.' },
    { rank: 11, name:"The Time Warrior", series:"11", era:"Classic", broadcastYear:"1973", director:"Alan Bromly", writer:"Robert Holmes", doctor:"Jon Pertwee (3rd Doctor)", companion:"Elisabeth Sladen (Sarah Jane Smith)", castCount:"8", plot:"The Doctor battles a Sontaran." },
    { rank: 12, name:"Genesis of the Daleks", series:"12", era:"Classic", broadcastYear:"1975", director:"David Maloney", writer:"Terry Nation", doctor:"Tom Baker (4th Doctor)", companion:"Elizabeth Sladen (Sarah Jane Smith)", castCount:"6", plot:"The origins of the Daleks are revealed." },
    { rank: 13, name:"City of Death", series:"17", era:"Classic", broadcastYear:"1979", director:"Douglas Adams & Michael Hayes ", writer:"Douglas Adams & David Fisher ", doctor:"Tom Baker (4th Doctor)", companion:"Lalla Ward (Romana II)", castCount:"7", plot:"A time-traveling adventure in Paris." },
    { rank: 14, name:"Remembrance of the Daleks", series:"25", era:"Classic", broadcastYear:"1988", director:"Andrew Morgan ", writer:"Eric Saward ", doctor:"Sylvester McCoy (7th Doctor)", companion:"Sophie Aldred (Ace)", castCount:"10 ", plot :"The Daleks return to London." },
    { rank: 15, name :"Blink" , series :"3" , era :"Modern" , broadcastYear :"2007" , director :"Hettie Macdonald" , writer :"Steven Moffat" , doctor :"David Tennant (10th Doctor)" , companion :"Catherine Tate (Donna Noble)" , castCount :"6" , plot :"Timey-wimey adventures with Weeping Angels." }
];

const doctors = [
    { name : 'Christopher Eccleston', number : '(9th Doctor)' },
    { name : 'David Tennant', number : '(10th Doctor)' },
    { name : 'Matt Smith', number : '(11th Doctor)' },
    { name : 'Peter Capaldi', number : '(12th Doctor)' },
    { name : 'Jodie Whittaker', number : '(13th Doctor)' },
    { name : 'Tom Baker', number : '(4th Doctor)' },
    { name : 'Jon Pertwee', number : '(3rd Doctor)' },
    { name : 'Patrick Troughton', number : '(2nd Doctor)' },
    { name : 'William Hartnell', number : '(1st Doctor)' },
    { name : 'Sylvester McCoy', number : '(7th Doctor)' },
    { name:'Catherine Tate', number:'(Donna Noble)' },
    { name:'Freema Agyeman', number:'(Martha Jones)' },
    { name:'Alex Kingston', number:'(River Song)' },
    { name:'John Barrowman', number:'(Captain Jack Harkness)' }
];

const eraIcons = { 
    Classic:'images/classic.jpg', 
    Modern:'images/modern.jpg', 
    Recent:'images/recent.jpg' 
};

const populateFilters = () => {
    const eraSelect = document.getElementById('era-filter');
    const doctorSelect = document.getElementById('doctor-filter');
    const companionSelect = document.getElementById('companion-filter');

    const eras = [...new Set(episodes.map(episode => episode.era))];
    
    eras.forEach(era => {
        const option = document.createElement('option');
        option.value = era;
        option.textContent = era;
        eraSelect.appendChild(option);
    });

    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.name;
        option.textContent = `${doctor.name} ${doctor.number}`;
        doctorSelect.appendChild(option);
    });

    const companions = [...new Set(episodes.map(episode => episode.companion))];
    
    companions.forEach(companion => {
        const option = document.createElement('option');
        option.value = companion;
        option.textContent = companion;
        companionSelect.appendChild(option);
    });
};

const filterEpisodes = () => {
    const nameFilter = document.getElementById('name-filter').value.toLowerCase(); 
    const eraFilter = document.getElementById('era-filter').value; 
    const doctorFilter = document.getElementById('doctor-filter').value; 
    const companionFilter = document.getElementById('companion-filter').value; 

    const filteredEpisodes = episodes.filter(episode => {
        return episode.name.toLowerCase().includes(nameFilter) && 
               (eraFilter === "" || episode.era === eraFilter) && 
               (doctorFilter === "" || episode.doctor.includes(doctorFilter)) && 
               (companionFilter === "" || episode.companion.includes(companionFilter)); 
    });

    displayEpisodes(filteredEpisodes); 
};

const displayEpisodes = (filteredEpisodes) => {
    const episodesList = document.querySelector('.episodes-list'); 
    episodesList.innerHTML = ''; 

    filteredEpisodes.forEach(episode => {
        const row = document.createElement('div'); 
        row.className = 'episode-row'; 
        row.innerHTML = ` 
            <div class="episode-cell">${episode.rank}</div> 
            <div class="episode-cell">${episode.name}</div> 
            <div class="episode-cell">${episode.series}</div> 
            <div class="episode-cell"><img src="${eraIcons[episode.era]}" class="era-icon" alt="${episode.era} Era">${episode.era}</div> 
            <div class="episode-cell">${episode.broadcastYear}</div> 
            <div class="episode-cell">${episode.director}</div> 
            <div class="episode-cell">${episode.writer}</div> 
            <div class="episode-cell">${episode.doctor}</div> 
            <div class="episode-cell">${episode.companion}</div> 
            <div class="episode-cell">${episode.castCount}</div> 
            <div class="episode-cell plot-preview">${episode.plot.length > 50 ? episode.plot.substring(0, 47) + '...' : episode.plot}</div> 
        `; 
        episodesList.appendChild(row); 
    }); 
};

document.addEventListener('DOMContentLoaded', () => {
   populateFilters();
   displayEpisodes(episodes);
});

document.querySelectorAll('.filter-group input, .filter-group select').forEach(input => {
   input.addEventListener('input', filterEpisodes); 
});