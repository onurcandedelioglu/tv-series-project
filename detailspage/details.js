let baseEndpoint = "https://api.tvmaze.com";
let params = new URLSearchParams(window.location.search);

let isTvShows = params.has('id');
if(isTvShows){
    let seriesId = params.get('id');
    showDetail(seriesId);
}

let selectBox = document.querySelector('[data-select]');
let subject = document.querySelector('[data-subject]');
let summaryButton = document.querySelector("[data-summary-button]");

function showDetail(id){

    //SHOW DETAILS

    let detailsEndpoint = `${baseEndpoint}/shows/${id}`;

    fetch(detailsEndpoint)
    .then(response => {
        if(!response.ok) {
            throw "There were no results";
        }
        return response.json();
    })
    .then(response => {
        let seriesImage = response.image.medium;
        let img = document.querySelector('[data-image]');
        img.src= seriesImage;

        let seriesName = response.name;
        let name = document.querySelector('[data-name]');
        name.innerHTML = seriesName.toUpperCase();

        let summary = response.summary;
        summary = summary.replace(/<p[^>]*>/g,"");
        summary = summary.replace(/<\/?p[^>]*>/g, "");
        let summarySection = `
            <div data-summary-text class="details__summarytext"><p class="details__text">${summary}</p></div>
        `
        subject.insertAdjacentHTML("afterbegin", summarySection);
        let summaryTextArea = document.querySelector('[data-summary-text]');
        let summaryTextHeight = summaryTextArea.offsetHeight;
        if(summaryTextHeight > 360){
            summaryButton.classList.add('-activeButton');
        }
    }).catch(error => {
        subject.innerHTML = `This Tv Show Faulty.`;
    })

    //CAST

    let castEndpoint = `${baseEndpoint}/shows/${id}/cast`;
    
    fetch(castEndpoint)
    .then(response => {
        if(!response.ok) {
                throw "There were no results";
            }
        return response.json();
    })
    .then(response => {
        let castParent = document.querySelector('[data-cast]');

        let cast = response;
        let count = 0;
        cast.forEach(item => {
            if(count > 5) return false;
            let castImage = item.person.image.medium;
            let castName = item.person.name;
            let characterName = item.character.name;

            let castAside = `
                <div class="details__info">
                    <img class="details__castimage" src="${castImage}">
                    <p class="details__castname">${castName}</p>
                    <p class="details__charactername">${characterName}</p>
                </div>
            `

            castParent.insertAdjacentHTML("beforeend", castAside);
            count++;
        });
    }).catch(error => {
        // let castParent = document.querySelector('[data-cast]');
        // let errorHandle = `
        // <p class="error__handle">Cast Not Found.</p>
        // `;
        // castParent.insertAdjacentHTML("beforeend", errorHandle);
    })

    //SEASON

    let seasonEndpoint = `${baseEndpoint}/shows/${id}/seasons`;
    
    fetch(seasonEndpoint)
    .then(response => {
        if(!response.ok) {
                throw "There were no results";
            }
        return response.json();
    })
    .then(response => {
        let seasonParent = document.querySelector('[data-season]');

        let season = response;

        season.forEach(item => {
            let number = item.number;
            let premiereDate = item.premiereDate;
            let seasonId = item.id;

            if(premiereDate == null) return; //continue ve break yapılamıyor.

            let seasonAside = `
                <button data-button data-season-number="${number}" data-season-episode-id="${seasonId}" class="season__button">
                    <span class="season__number"> Season ${number}</span>
                    <span class="season__date">${premiereDate}</span>
                </button>
            `
            seasonParent.insertAdjacentHTML("beforeend", seasonAside);

            let selectBoxOption = `
                <option data-option class="season__option" select-season-number="${number}" select-season-episode-id="${seasonId}">Season ${number}
                </option>
            `  
            selectBox.insertAdjacentHTML("beforeend",selectBoxOption);

        });

        let seasonButton = document.querySelectorAll('[data-button]');
        seasonButton.forEach(button => {
            button.addEventListener('click', selectSeason);
        });

        seasonButton[0].classList.add("-selectedSeason");
        getSummary(season[0].id, season[0].number);
        getEpisodes(season[0].id);
    }).catch(error => {
        // let seasonParent = document.querySelector('[data-season]');
        // let errorHandle = `
        // <p class="error__handle">Season Not Found.</p>
        // `;
        // seasonParent.insertAdjacentHTML("beforeend", errorHandle);
    })
}

let seasonSection = document.querySelector("[data-scroll]");
function selectSeason(event){
    seasonSection.scrollIntoView(true)
    let buttons = document.querySelectorAll('[data-button]');
    buttons.forEach(item => {
        item.classList.remove("-selectedSeason");
    })

    let pressedButton = event.target;
    pressedButton.classList.add("-selectedSeason");

    let seasonNumber = pressedButton.getAttribute('data-season-number');
    let seasonNumberItem = document.querySelector('[data-season-episode]');
    seasonNumberItem.innerHTML = `Season ${seasonNumber}`;

    let seasonEpisodeId = pressedButton.getAttribute('data-season-episode-id');

    getSummary(seasonEpisodeId, seasonNumber);
    getEpisodes(seasonEpisodeId);

    let episodeSeason = document.querySelectorAll('[data-episode-aside]');
        episodeSeason.forEach(item => {
            item.remove();
    })
}


function getSummary(seasonEpisodeId, seasonNumber){
    let seasonEndpoint = `${baseEndpoint}/seasons/${seasonEpisodeId}`;
    let summaryItem = document.querySelector('[data-summary]');

    let seasonNumberItem = document.querySelector('[data-season-episode]');
    seasonNumberItem.innerHTML = `Season ${seasonNumber}`;
    
    fetch(seasonEndpoint)
    .then(response => {
        if(!response.ok) {
                throw "There were no results";
            }
        return response.json();
    })
    .then(response => {
        summaryItem.innerHTML = response.summary;
    }).catch(error => {
        // let summaryItem = document.querySelector('[data-summary]');
        // summaryItem.innerHTML = `Season Summary Not Found.`;
    })
}
let seriesPicture = document.querySelector('[data-image]').src;
function getEpisodes(seasonEpisodeId){

    let seasonEpisodesEndpoint = `${baseEndpoint}/seasons/${seasonEpisodeId}/episodes`;
    fetch(seasonEpisodesEndpoint)
    .then(response => {
        if(!response.ok) {
                throw "There were no results";
            }
        return response.json();
    })
    .then(response => {
        let episodeParent = document.querySelector('[data-episode]');

        let episode = response;

        let errorsEpisodes = document.querySelectorAll('[data-error]');
        errorsEpisodes.forEach(item => {
            item.remove();
        })
        episode.forEach(item => {
            let episodeNumber = item.number;
            let episodeName = item.name;
            let episodeImage;
            if(item.image == null) episodeImage = document.querySelector("[data-image]").src;
            else episodeImage = item.image.medium;
            
            if(episodeNumber == null){
                episodeNumber = "Special";
            }
            let episodeAside = `
                <div data-episode-aside=${episodeNumber} class="season__episodeaside" style="background-image:url(${episodeImage})">
                    <h2 class="season__episodenumber">Episode ${episodeNumber}</h2>
                    <h2 class="season__episodename">${episodeName}</h2>
                </div>
            `
            episodeParent.insertAdjacentHTML("beforeend", episodeAside);
        });
    }).catch(error => {
        // let episodeParent = document.querySelector('[data-episode]');
        // let errorHandle = `
        // <p data-error class="error__handle">Episodes Not Found.</p>
        // `
        // episodeParent.insertAdjacentHTML("beforeend", errorHandle);
    })
}
let detailSubject = document.querySelector('[details-subject]');
summaryButton.addEventListener('click', showMore)
function showMore(){
    let isPressedButton = summaryButton.getAttribute("data-summary-button");
    if(isPressedButton == "true"){
        subject.classList.add("-active");
        summaryButton.setAttribute("data-summary-button", "false");
        summaryButton.innerHTML = "Less Show";
        return false;
    }
    subject.classList.remove("-active");
    summaryButton.setAttribute("data-summary-button", "true");
    summaryButton.innerHTML = "Read More";
    detailSubject.scrollIntoView(true)
    return true;
}

function selectBoxSeason(event){
    seasonSection.scrollIntoView(true)
    let seasonIndex = selectBox.options[selectBox.selectedIndex];
    let seasonId = seasonIndex.getAttribute("select-season-number");
    let seasonEpisodeId = seasonIndex.getAttribute("select-season-episode-id");
    getSummary(seasonEpisodeId, seasonId);
    getEpisodes(seasonEpisodeId);
    let episodeSeason = document.querySelectorAll('[data-episode-aside]');
        episodeSeason.forEach(item => {
            item.remove();
    })
}
selectBox.addEventListener('change', selectBoxSeason);

