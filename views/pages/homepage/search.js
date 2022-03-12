let menuButton = document.querySelector('[data-menu-button]');
let menuInputBox = document.querySelector('[data-menu-input]');
menuInputBox.addEventListener('keyup',changeMenuUrl);

function changeMenuUrl(event){
    if(event.key == 'Enter') window.location.href = menuButton.href;
    let menuInputText = menuInputBox.value;
    menuButton.href = `./searchpage?series=${menuInputText}`;
}

let searchBarButton = document.querySelector('[data-search-button]');
let inputBox = document.querySelector('[data-input]');
inputBox.addEventListener('keyup',changeBarUrl);

function changeBarUrl(event){
    if(event.key == 'Enter') window.location.href = searchBarButton.href;
    let searchBarText = inputBox.value;
    searchBarButton.href = `./searchpage?series=${searchBarText}`;
}