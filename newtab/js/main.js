function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

const REFRESHTIME = 60 * 30; // time in seconds of weather refresh, default is half an hour

function displayweather(weatherdata) {
    let feelslike = document.getElementById("wmo"); // display p's based on font size
    let other = document.getElementById("other");
    let iconspan = document.getElementById("wmoiconspan");
    let icon = document.getElementById("wmoicon");
    let curwmo = wcjson[weatherdata.weather_code][{0: "night", 1: "day"}[weatherdata.is_day]]; // wcjson is from wmocodes.js

    feelslike.innerHTML = `${curwmo.description}`
    other.innerHTML = `Feels like <b>${weatherdata.apparent_temperature}°</b><br>
Temp: <b>${weatherdata.temperature_2m}°</b><br>
Humidity: <b>${weatherdata.relative_humidity_2m}%</b><br>
Chance of Rain: <b>${weatherdata.precipitation_probability}%</b><br>`
    iconspan.style.height = "64px"
    icon.src = "https://openweathermap.org/img/wn/" + curwmo.image;
    document.getElementById("updating").innerHTML = ""; // remove updating symbol if it exists
    console.log("DEBUG: Weather display refreshed");
}

function weather(lat, long) {
    console.log(`DEBUG: trying to fetch updated weather data at time ${new Date().toISOString()} UTC`);
    fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}\
&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,is_day\
&daily=sunrise,sunset&timeformat=unixtime&timezone=auto&forecast_days=1`,
        {keepalive: true}
    ).then(
        (response) => {
            if (!response.ok) {
                throw new Error(`Weather API fetch failed with status ${response.status}`);
            }
            return response.json();
        }
    ).then(
        (data) => {
            weatherdata = {...data.daily, ...data.current};
            localStorage.setItem("weatherdata", JSON.stringify(weatherdata));
            displayweather(weatherdata);
            console.log("DEBUG: Weather data fetched!");
            console.log(`DEBUG: Weather data last updated at ${weatherdata.time}`);
        }
    )
}

function checkWeather() {
    // check if weather cached, otherwise fetch new
    if (!("geolocation" in navigator)) {
        // geolocation unavailable
        console.log("WARNING: geolocation not available in navigator");
        return;
    }

    let weatherdata = JSON.parse(localStorage.getItem("weatherdata"));

    if (weatherdata !== null) {
        // data exists and is recent
        displayweather(weatherdata); // display cached data
        if (weatherdata.time > (Date.now() / 1000 - REFRESHTIME)) {
            return;
        }
    }

    document.getElementById("updating").innerHTML = "Updating...";
    navigator.geolocation.getCurrentPosition((position) => {
        weather(
            round(position.coords.latitude, 2),
            round(position.coords.longitude, 2)
        );
    });
}

checkWeather();

// refresh every REFRESHTIME seconds and ping the API if necessary
setInterval(checkWeather, REFRESHTIME * 1000);

// if another tab updates, display the update
addEventListener("storage", (event) => {
    console.log("DEBUG: localStorage changed detected, syncing data...");
    displayweather(JSON.parse(localStorage.getItem("weatherdata")));
});