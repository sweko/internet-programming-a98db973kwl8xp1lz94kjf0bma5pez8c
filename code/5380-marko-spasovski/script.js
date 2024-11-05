(() =>document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the application when the DOM is fully loaded
    let data = await fetchData();

    const originalData = [];
    originalData.push(...data);
    displayData(data);


    
    const headers = getAllHeaders();

    const headerObject = {
        rank : headers[0],
        name : headers[1],
        series : headers[2],
        era : headers[3],
        broadcast : headers[4],
        director : headers[5],
        writer : headers[6],
        doctor : headers[7],
        companion : headers[8],
        cast : headers[9],
        plot : headers[10],
    }

    
    Object.keys(headerObject).forEach(key => {
        headerObject[key].addEventListener('click', () =>{
            sort(headerObject[key], data);
        })
    })


    const submit = document.getElementById('submit');

    submit.addEventListener('click', (event) => {
        event.preventDefault();
        filterData(data);
    }); 

    

}))();


const clearHeaders = () => {
    const headers = getAllHeaders();
    for(const header of headers){
        header.classList.remove("sorted");
        header.classList.remove("unsorted");
        // header.classList
        header.classList.remove("ascending");
        header.classList.remove("descending");
    }
}
let isAscending = true;
const sort = (key, data) =>{
    const episodeList = document.getElementsByClassName("episodes-list")[0];
    episodeList.textContent = '';
    
    clearHeaders();

    key.classList.toggle("sorted");

    
    const coppiedData = [...data];
    
    

    if(key.getAttribute('data-sort') === 'rank'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.rank - b.rank)
            isAscending = false;
            displayData(filteredData);
            key.classList.add("descending");
        }else{
            const filteredData = coppiedData.sort((a, b) => b.rank - a.rank)
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }

    }else if(key.getAttribute('data-sort') === 'name'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.title.localeCompare(b.title))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.title.localeCompare(a.title))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }

    }else if(key.getAttribute('data-sort') === 'series'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.series - b.series)
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.series - a.series)
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'era'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.era.localeCompare(b.era))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.era.localeCompare(a.era))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'broadcast'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => (getBrodcastYear(a.broadcast_date)) - (getBrodcastYear(b.broadcast_date)))
            key.classList.add("descending");
            isAscending = false;
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => (getBrodcastYear(b.broadcast_date)) - (getBrodcastYear(a.broadcast_date)))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'director'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.director.localeCompare(b.director))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.director.localeCompare(a.director))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'writer'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.writer.localeCompare(b.writer))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.writer.localeCompare(a.writer))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'doctor'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => getDoctor(a).localeCompare(getDoctor(b)))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) =>  getDoctor(b).localeCompare(getDoctor(a)))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'companion'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => getCompanion(a).localeCompare(getCompanion(b)))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) =>  getCompanion(b).localeCompare(getCompanion(a)))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'cast'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.cast.length - b.cast.length)
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.cast.length - a.cast.length)
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }else if(key.getAttribute('data-sort') === 'plot'){
        if(isAscending){
            const filteredData = coppiedData.sort((a, b) => a.plot.localeCompare(b.plot))
            isAscending = false;
            key.classList.add("descending");
            displayData(filteredData);
        }else{
            const filteredData = coppiedData.sort((a, b) => b.plot.localeCompare(a.plot))
            isAscending = true;
            key.classList.add("ascending");
            displayData(filteredData);
        }
    }
}  
const getHeaderDiv = () =>{
    const div = document.createElement("div");

    div.innerHTML = `
            <div class="episodes-header">
                <div class="header-cell" data-sort="rank" >Rank</div>
                <div class="header-cell" data-sort="name">Name</div>
                <div class="header-cell" data-sort="series">Series</div>
                <div class="header-cell" data-sort="era">Era</div>
                <div class="header-cell" data-sort="broadcast">Broadcast Year</div>
                <div class="header-cell" data-sort="director">Director</div>
                <div class="header-cell" data-sort="writer">Writer</div>
                <div class="header-cell" data-sort="doctor">Doctor</div>
                <div class="header-cell" data-sort="companion">Companion</div>
                <div class="header-cell" data-sort="cast">Cast</div>
                <div class="header-cell" data-sort="plot">Plot</div>
            </div>
    `

    return div;
}
const getAllHeaders = () =>{
    const headers = document.getElementsByClassName('header-cell');
    
    return [...headers];  //this may be an error
}
const fetchData = async() =>{
    url = "https://raw.githubusercontent.com/sweko/internet-programming-a98db973kwl8xp1lz94kjf0bma5pez8c/refs/heads/main/data/doctor-who-episodes.json";

    try{
        
        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Error fetching");
        }

        const data = await response.json();
        const episodesData = data.episodes;


        return episodesData;
        

    }catch(err){
        console.log(`Error fetching ${err}`);
    }
}
const getBrodcastYear = (date) =>{
    const broadcast_date = new Date(date);
    return broadcast_date.getFullYear();
}
const getDoctor = (episode) => {
    return `${episode.doctor.actor} (${episode.doctor.incarnation})`;
}

const getDoctorForFilter = (episode) => {
    return `${episode.doctor.actor}`;
}
const getCompanion = (episode) => {
    return `${episode.companion.actor} (${episode.companion.character})`;
}
const getCompanionForFilter = (episode) => {
    return `${episode.companion.actor}`;
}
const displayData = (data) =>{
    const episodeList = document.getElementsByClassName("episodes-list");
    episodeList[0].textContent = '';    
    
    const eras = new Set([...data].map(a => a.era));
    const doctors = new Set([...data].map(a => a.doctor.actor))
    const companions = new Set([...data].map(a => a.companion.actor))

    

    const eraObject = document.getElementById("era-filter");
    const doctorObject = document.getElementById("doctor-filter");
    const companionObject = document.getElementById("companion-filter");


    
    populateDropdown(eraObject, eras);
    populateDropdown(doctorObject, doctors);
    populateDropdown(companionObject, companions);

    
    
    for(const episode of data){
        const newDiv = document.createElement("div");

        newDiv.classList.add("episode-row");

    
        const broadcastYear = getBrodcastYear(episode.broadcast_date);

        const doctor = getDoctor(episode);
        const companion = getCompanion(episode);

        newDiv.innerHTML = `
        <div class="episode-cell">${episode.rank}</div>
        <div class="episode-cell">${episode.title}</div>
        <div class="episode-cell">${episode.series}</div>
        <div class="episode-cell">${episode.era}</div>
        <div class="episode-cell">${broadcastYear}</div>
        <div class="episode-cell">${episode.director}</div>
        <div class="episode-cell">${episode.writer}</div>
        <div class="episode-cell">${doctor}</div>
        <div class="episode-cell">${companion}</div>
        <div class="episode-cell">${episode.cast.length}</div>
        <div class="episode-cell">${episode.plot}</div>
        `
        episodeList[0].appendChild(newDiv);
    };

}
const populateDropdown = (obj, data) =>{
    for(const element of data){
        const option = document.createElement("option");
        option.setAttribute("value", element);
        option.textContent = element;
        obj.appendChild(option);
    }
}
const filterData = (data) =>{
    const eraObject = document.getElementById("era-filter");
    const doctorObject = document.getElementById("doctor-filter");
    const companionObject = document.getElementById("companion-filter");
    const nameObject = document.getElementById("name-filter");
    
  
    
    
    clearHeaders();
    
    let filteredData = [...data];

    

    if(eraObject.value != ''){
        filteredData = filteredData.filter(a => {
            const era_first = a.era;
            const era_second = eraObject.value;

            return era_first === era_second;
        });
    }

    if(doctorObject.value != ''){
        filteredData = filteredData.filter(a => {
            const doctor_first = getDoctorForFilter(a);
            const doctor_second = doctorObject.value;

            
            return doctor_first === doctor_second;
            
        });
    }

    
    if(companionObject.value != ''){
        filteredData = filteredData.filter(a => {
            const companion_first = getCompanionForFilter(a).trim();
            const companion_second = companionObject.value;

            
            return companion_first === companion_second;
            
        });
    }
    

    if(nameObject.value != ''){
        filteredData = filteredData.filter(a => a.title === nameObject.value)
    }

    displayData(filteredData);


    eraObject.value = '';
    doctorObject.value = '';
    companionObject.value = '';

    
    

}