function searchBoxUpdate(ev) {
    if (ev.target.value.length > 0) {
        searchMovies(ev.target.value, (response, movies) => {
            updateSearchUI(response, movies);
        })
    }
}

function resultClicked(ev) {
    getMovie(ev.target.id, (response, movie) => {
        updateDetailUI(response,movie);
    })
}

function searchMovies(searchTerm, callback) {
    let apiKey = getKey('unknown');
    let url = `http://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;
    let movies = {};
    let request = new XMLHttpRequest()
    request.onload = function() {
        movies = JSON.parse(this.responseText);
        if (movies.Response=='True') {
            callback(movies.Response, movies.Search);
        }
        else {
            let noResult = [];
            noResult.push(movies.Error);
            callback(movies.Response, noResult);
        }
    }
    request.open('GET',url);
    request.send();
}

function getMovie(movieId, callback) {
    let apiKey = getKey('unknown');
    let url = `http://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;
    let movie = {};
    let request = new XMLHttpRequest()
    request.onload = function() {
        movie = JSON.parse(this.responseText);
        if (movie.Response=='True') {
            callback(movie.Response, movie);
        }
        else {
            callback(movie.Response, movie.Error);
        }
    }
    request.open('GET',url);
    request.send();
}

function updateSearchUI(response, movies) {
    // a movie contains Title, Year, imdbID, Type, Poster (url to .jpg)

    let container = document.getElementById("container");
    // make sure search results section is displayed
    container.style.display = 'flex';

    if (response=='False') {
       container.innerHTML = movies[0];
    }
    else {
        // update UI with search results
        let allResults = movies.map((item) => createSearchItem(item));
        let allResultsHTML = allResults.join(' ');
        container.innerHTML = allResultsHTML;
    }

    // clear the detail section
    let detail = document.getElementById("detail");
    detail.innerHTML = '';
}

function createSearchItem(item) {
    // create HTML for one search result item
    let resultItem = `<div class="searchresult">
                        <img class="poster" src=${item.Poster} />
                        <label class="title" id="${item.imdbID}" onclick="resultClicked(event)" >${item.Title} (${item.Year})</label>
                      </div>`
    return resultItem;
}

function updateDetailUI(response, movie) {
    /* a movie contains:
            Actors, Awards, BoxOffice, Country, DVD, Director, Genre, Language, Metascore,
            Plot, Poster (url to .jpg), Production, Rated, Ratings[Source, Value], Released,
            Response, Runtime, Title, Type, Website, Writer, Year, imdbID, imdbRating, imdbVotes
    */

    let container = document.getElementById("container");
    container.style.display = 'none';
    
    if (response=='False') {
        detail.innerHTML = movie;
    }
    else {
        // update UI with movie detail info
        detailHTML = `<div class="detail_title">${movie.Title}</div>
                      <div class="detail_wrapper">
                        <img class="detail_poster" src=${movie.Poster} />
                        <div class="detail_info">
                          <div class="detail_info_item">Year: ${movie.Year}</div>
                          <div class="detail_info_item">Rated: ${movie.Rated}</div>
                          <div class="detail_info_item">Released: ${movie.Released}</div>
                          <div class="detail_info_item">Director: ${movie.Director}</div>
                        </div>
                      </div>`;

        let detail = document.getElementById("detail");
        detail.innerHTML = detailHTML;
    }
}

function getKey(status) {
    // handle storage and retrieval of local API key
    // incoming status should be 'unknown' or 'bad'
    let key = null;
    let today = new Date();

    if (status=='bad') {
        localStorage.removeItem("keyOMDb");
        localStorage.removeItem("keyOMDbDate");
    }
    // check for expired key
    expDate_str = localStorage.getItem("keyOMDbDate");
    if (expDate_str != null) {
        expDate = new Date(expDate_str);
        if (expDate < today) {
            // cached key expired - remove it
            status = 'expired';
            localStorage.removeItem("keyOMDb");
            localStorage.removeItem("keyOMDbDate");
        }
        key = localStorage.getItem("keyOMDb");
    }
    
    // get a new key from user, store it with today's date + 1 month, return the new key
    if (key==null) {
        // set message based on status
        let msg = '';
        if (status=='bad') {
            msg = 'Bad key - please enter valid OMDb API key (will be cached in localStorage for 1 month)';
        }
        else if (status=='expired') {
            msg = 'Locally cached key expired - please enter OMDb API key (will be cached in localStorage for 1 month)';
        }
        else {
            msg = 'No key found - please enter OMDb API key (will be cached in localStorage for 1 month)';
        }
        key = window.prompt(msg);
        localStorage.setItem("keyOMDb",key);
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
        localStorage.setItem("keyOMDbDate",expDate.toDateString());
    }
    
    return key;
}
