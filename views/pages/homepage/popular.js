let baseEndpoint = "/api";

let imageUrlId = [335,66,44,123,43677];
imageUrl();

function imageUrl(){
    for(let index = 0; index < 5; index++){
        let imageLinkItem = document.querySelectorAll(`[data-link="${index}"]`);
        imageLinkItem.forEach(item => {
            item.href = `./details?id=${imageUrlId[index]}`;
        })
    }
}

popularTvSeries();
function popularTvSeries(){
    let showsEndpoint = `${baseEndpoint}/series`;
    
    fetch(showsEndpoint)
    .then(response => {
        if(!response.ok) {
                throw "Failed To Sort Popular List";
            }
        return response.json();
    })
    .then(response => {
        response = response.sort((responseFirstItem, responseSecondItem) => {

            let tvSeries = responseFirstItem.rating;
            let firstImdb = Object.values(tvSeries);

            let secondTvSeries = responseSecondItem.rating;
            let secondImdb = Object.values(secondTvSeries);

            if(firstImdb[0] == null) firstImdb[0] = 0;
            if(secondImdb[0] == null) secondImdb[0] = 0;

            return parseFloat(firstImdb) - parseFloat(secondImdb);
        })
        let topTenSeries = response.slice(Math.max(response.length - 10, 1));
        showPopularImage(topTenSeries)
    }).catch(error => {
        alert(`${error}`);
    })
}
function showPopularImage(topTen){
    for(let i = 0; i < topTen.length; i++){

        let series = topTen[i];

        let popularCard = document.querySelector(`[data-popular="${i}"]`);
        let cardImage = popularCard.querySelector('[data-image]');
        let mediumImage = series.image.medium;
        cardImage.src = mediumImage;

        let colorthief = new ColorThief();
        cardImage = popularCard.querySelector('[data-image]');
        cardImage.addEventListener('load',function(){
            let rgb = colorthief.getColor(cardImage)
            let red = rgb[0];
            let green = rgb[1];
            let blue = rgb[2];
            let cardDetails = popularCard.querySelector('[data-popular-details]');
            cardDetails.style.backgroundColor = `rgb(${red},${green},${blue})`;
        })        

        let seriesTitle = popularCard.querySelector('[data-title]');
        let seriesName = series.name;
        seriesTitle.innerHTML = seriesName;

        let seriesImdbFind = topTen[i].rating;
        let seriesAvarage = Object.values(seriesImdbFind);
        let seriesImdb = popularCard.querySelector('[data-imdb]');
        seriesImdb.innerHTML = `${seriesAvarage[0]}`;

        let seriesGenresItem = popularCard.querySelector('[data-genres');
        let seriesGenres = series.genres;
        seriesGenresItem.innerHTML = seriesGenres
        
        let seriesId = series.id;
        popularCard.href = `./details?id=${seriesId}`;
    }
}