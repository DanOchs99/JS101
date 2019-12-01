let sourcesContainer = document.getElementById("container"); 

let allSources = sources.sources.map((source) => createItem(source));
let allSourcesHTML = allSources.join(' ');
sourcesContainer.innerHTML = allSourcesHTML;

function createItem(source) {
    // add buttons and descriptions for news sources
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
    keyNews = getKey('unknown');
    
    console.log(`Go get news from ${button.id}...`);

    let url = `https://newsapi.org/v2/top-headlines?sources=${button.id}&apiKey=${keyNews}`;
    let req = new Request(url);
    fetch(req)
        .then(function(response) {
            response.json()
            .then(function(myJSON) {
                console.log(JSON.stringify(myJSON));
            });
        })
}

function getKey(status) {
    // handle storage and retrieval of local API key
    // incoming status should be 'unknown' or 'bad'
    let key = null;
    let today = new Date();

    if (status=='bad') {
        localStorage.removeItem("keyNews");
        localStorage.removeItem("keyDate");
    }
    // check for expired key
    expDate_str = localStorage.getItem("keyDate");
    if (expDate_str != null) {
        expDate = new Date(expDate_str);
        if (expDate < today) {
            // cached key expired - remove it
            status = 'expired';
            localStorage.removeItem("keyNews");
            localStorage.removeItem("keyDate");
        }
        key = localStorage.getItem("keyNews");
    }
    
    // get a new key from user, store it with today's date + 1 month, return the new key
    if (key==null) {
        // set message based on status
        let msg = '';
        if (status=='bad') {
            msg = 'Bad key - please enter valid NewsAPI key (will be cached in localStorage for 1 month)';
        }
        else if (status=='expired') {
            msg = 'Locally cached key expired - please enter NewsAPI key (will be cached in localStorage for 1 month)';
        }
        else {
            msg = 'No key found - please enter NewsAPI key (will be cached in localStorage for 1 month)';
        }
        key = window.prompt(msg);
        localStorage.setItem("keyNews",key);
        let expDate = new Date();
        let month = expDate.getMonth();
        if (month < 11) {
            month +=1;
        }
        else {
            month = 0;
            let year = expDate.getFullYear();
            year += 1;
            expDate.setFullYear(year);
        }
        expDate.setMonth(month);
        localStorage.setItem("keyDate",expDate.toDateString());
    }
    
    return key;
}