// Weather App
const cityTextBox = document.getElementById('cityTextBox');
const goButton = document.getElementById('goButton');
const container = document.getElementById('container');

function getCityId(inCity) {
    // check city_list file for user input and retrieve city id
    let cityId  = {city: '', id: -1, lat: 0, lon: 0};
    inCityParts = inCity.split(',');
    if (inCityParts.length == 1) {
        // city name only search
        inCityParts[0] = inCityParts[0].trim();
        for (i in cities) {
            if (inCityParts[0] == cities[i].name) {
                cityId.city = `${cities[i].name}, ${cities[i].country}`;
                cityId.id = cities[i].id;
                cityId.lat = cities[i].coord.lat;
                cityId.lon = cities[i].coord.lon;
                break;
            } 
        }
    }
    else if (inCityParts.length == 2) {
        // city name and country search
        inCityParts[0] = inCityParts[0].trim();
        inCityParts[1] = inCityParts[1].trim();
        for (i in cities) {
            if ((inCityParts[0] == cities[i].name) && (inCityParts[1] == cities[i].country)) {
                cityId.city = `${cities[i].name}, ${cities[i].country}`;
                cityId.id = cities[i].id;
                cityId.lat = cities[i].coord.lat;
                cityId.lon = cities[i].coord.lon;
                break;
            } 
        }
    }
    else {
        // something went wrong
        cityId.id = -1;
    }
    return cityId;
}

goButton.addEventListener('click',() => {
    let city = cityTextBox.value;
    if ((city != '') && (city != 'here')) {
        let cityId = getCityId(city);
        if (cityId.id == -1) {
            container.innerHTML = '<div class="status">Location not found.</div>';
        }
        else {
            container.innerHTML = `<div class="status">Fetching weather for ${cityId.city} (id = ${cityId.id}) (${cityId.lat},${cityId.lon})...</div>`;
            let key = getKey('unknown');
            // add an error check here?
            getWeather(cityId, key);
        }
    }
    else if (city == 'here') {
        // fix this routine
        container.innerHTML = `<div class="status">Getting current location...</div>`;
        getLocation();
    }    
    else {
        container.innerHTML = '<div class="status">Please enter a location.</div>';
    }
});

async function getWeather(cityId, key) {
    let url = `http://api.openweathermap.org/data/2.5/weather?id=${cityId.id}&appid=${key}&units=imperial`;
    let response = await fetch(url);
    let weather = await response.json();
    updateUI(cityId, weather);
    return;
}

async function getLocation() {
    let cityId = {city: '', id: -1, lat: 0, lon: 0};
    if (navigator.geolocation) {
        let x = await navigator.geolocation.getCurrentPosition((position) => {
            container.innerHTML = `<div class="status">Fetching weather for current location...
            <br>Latitude: ${position.coords.latitude.toFixed(2)}
            <br>Longitude: ${position.coords.longitude.toFixed(2)}</div>`;
            cityId.lat = position.coords.latitude;
            cityId.lon = position.coords.longitude;
            let key = getKey('unknown');
            // add an error check here?
            getWeatherByLoc(cityId, key);
            });
    }
    else {
        container.innerHTML = '<div class="status">Geolocation is not supported by this browser.</div>';
    }
    return;
}

async function getWeatherByLoc(cityId, key) {
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${cityId.lat}&lon=${cityId.lon}&appid=${key}&units=imperial`;
    let response = await fetch(url);
    let weather = await response.json();
    cityId.city = `${weather.name}`;
    cityId.id = weather.id;
    updateUI(cityId, weather);
    return;
}

function updateUI(cityId, weather) {
    container.innerHTML = `<div class="status">Displaying weather for ${cityId.city} (id = ${cityId.id}) (${cityId.lat},${cityId.lon})</div>
                           <div class="element">Temp: ${Math.round(weather.main.temp)} &deg;F</div>
                           <div class="element">Humidity: ${weather.main.humidity}%</div>
                           <div class="element">Barometer: ${weather.main.pressure} mbar</div>
                           <div class="element">Precipitation: ${weather.weather[0].main}</div>
                           <div class="element">Wind: ${Math.round(weather.wind.speed)} mph</div>`;
    return;
}

function getKey(status) {
    // handle storage and retrieval of local API key
    // incoming status should be 'unknown' or 'bad'
    let key = null;
    let today = new Date();

    if (status=='bad') {
        localStorage.removeItem("keyWeather");
        localStorage.removeItem("keyWeatherDate");
    }
    // check for expired key
    expDate_str = localStorage.getItem("keyWeatherDate");
    if (expDate_str != null) {
        expDate = new Date(expDate_str);
        if (expDate < today) {
            // cached key expired - remove it
            status = 'expired';
            localStorage.removeItem("keyWeather");
            localStorage.removeItem("keyWeatherDate");
        }
        key = localStorage.getItem("keyWeather");
    }
    
    // get a new key from user, store it with today's date + 1 month, return the new key
    if (key==null) {
        // set message based on status
        let msg = '';
        if (status=='bad') {
            msg = 'Bad key - please enter valid OpenWeatherAPI key (will be cached in localStorage for 1 month)';
        }
        else if (status=='expired') {
            msg = 'Locally cached key expired - please enter OpenWeatherAPI key (will be cached in localStorage for 1 month)';
        }
        else {
            msg = 'No key found - please enter OpenWeatherAPI key (will be cached in localStorage for 1 month)';
        }
        key = window.prompt(msg);
        localStorage.setItem("keyWeather",key);
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
        localStorage.setItem("keyWeatherDate",expDate.toDateString());
    }
    
    return key;
}
