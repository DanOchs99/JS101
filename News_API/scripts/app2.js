let sourcesContainer = document.getElementById("container"); 

let allSources = sources.sources.map((source) => createItem(source));
let allSourcesHTML = allSources.join(' ');
sourcesContainer.innerHTML = allSourcesHTML;

function createItem(source) {
    let sourceItem = `<div class="sourceItem">`;
    if (source.name != null) {
        sourceItem += `  <button class="sourceButton" id=${source.id} onclick="sourceClicked(this);" >${source.name}</button>`;
    }
    if (source.description != null) {
        sourceItem += `  <div class="sourceDesc" >${source.description}</div>`;
    }
    sourceItem += `</div>`;
    return sourceItem;
}

function sourceClicked(button) {
    
}
