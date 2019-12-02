let sourcesContainer = document.getElementById("container"); 

let allSources = sources.sources.map((source) => createItem(source));
let allSourcesHTML = allSources.join(' ');
sourcesContainer.innerHTML = allSourcesHTML;

function createItem(source) {
    // check news availability
    keyNews = getKey('unknown');
    let url = `https://newsapi.org/v2/top-headlines?sources=${source.id}&apiKey=${keyNews}`;
    let req = new Request(url);
    let numArticles = 1;   // fix this section !!
    //let sourceItem = '';
    //(async ()=> {
        //await fetch(req)
        //    .then(function(response) {
        //        response.json()
        //        .then(function(myJSON) {
        //            if (myJSON.status == 'ok') {
        //                numArticles = myJSON.articles.length;
        //            }
        //        });
        //    });
        // create button and description for this news source
        sourceItem = `<div class="sourceItem">`;
        if (source.name != null) {
            if (numArticles == 0) {
                sourceItem += `  <button class="sourceButton" id=${source.id} onclick="sourceClicked(this);" >${source.name}</button>`;
            }
            else {
                sourceItem += `  <button class="sourceButton active" id=${source.id} onclick="sourceClicked(this);" >${source.name}</button>`;
            }
        }
        if (source.description != null) {
            sourceItem += `  <div class="sourceDesc" >${source.description} (${numArticles})</div>`;
        }
        sourceItem += `</div>`;
    //})();
    return sourceItem;
}

function createNewsItem(article) {
    let newsItem = `<div class="newsItem">`;
    if (article.urlToImage != null) {
        newsItem += `  <img class="newsImage" src=${article.urlToImage} />`;
    }
    if (article.title != null) {
        newsItem += `  <div class="newsTitle" >${article.title}</div>`;
    }
    if (article.author != null) {
        newsItem += `  <div class="newsAuthor" >${article.author}</div>`;
    }
    if (article.description != null) {
        newsItem += `  <div class="newsDesc" >${article.description}</div>`;
    }
    if (article.url != null) {
        newsItem += `  <div class="newsURL" >${article.url}</div>`;
    }
    if (article.publishedAt != null) {
        pubDate = new Date(article.publishedAt);
        newsItem += `  <div class="newsDate" >${pubDate.toString()}</div>`;
    }
    newsItem += `</div>`;
    return newsItem;
}

function sourceClicked(button) {
    if (button.classList.contains('active')) {
        keyNews = getKey('unknown');

        let url = `https://newsapi.org/v2/top-headlines?sources=${button.id}&apiKey=${keyNews}`;
        let req = new Request(url);
        fetch(req)
            .then(function(response) {
                response.json()
                .then(function(myJSON) {
                    let title = document.getElementById("title");
                    title.innerHTML = button.innerHTML;

                    let children = sourcesContainer.children;
                    while (children.length > 0) {
                        sourcesContainer.removeChild(children[0]);
                    }
                    if (myJSON.articles.length > 0) {
                        let allNews = myJSON.articles.map((article) => createNewsItem(article));
                        let allNewsHTML = allNews.join(' ');
                        sourcesContainer.innerHTML = allNewsHTML;
                    }
                    else {
                        sourcesContainer.innerHTML = 'No news at this time.';
                    }
                });
            });
    }
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