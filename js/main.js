function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

const REFRESHTIME = 60 * 30 // time in seconds of weather refresh, default is half an hour

function displayweather(weatherdata) {
    let feelslike = document.getElementById("wmo"); // display p's based on font size
    let other = document.getElementById("other");
    let icon = document.getElementById("wmoicon");
    let curwmo = wcjson[weatherdata.weather_code][{0: "night", 1: "day"}[weatherdata.is_day]]; // wcjson is from wmocodes.js

    feelslike.innerHTML = `${curwmo.description}`
    other.innerHTML = `Feels like <b>${weatherdata.apparent_temperature}°</b><br>
Temp: <b>${weatherdata.temperature_2m}°</b><br>
Humidity: <b>${weatherdata.relative_humidity_2m}%</b><br>
Chance of Rain: <b>${weatherdata.precipitation_probability}%</b><br>`
    icon.src = "https://openweathermap.org/img/wn/" + curwmo.image;
}

function weather(lat, long) {
    console.log("DEBUG: trying to fetch updated weather data");
    fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}\
&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,is_day\
&daily=sunrise,sunset&timeformat=unixtime&timezone=auto&forecast_days=1`
    ).then(
        (response) => (response.json())
    ).then(
        (data) => {
            weatherdata = {...data.current, ...data.daily};
            localStorage.setItem("weatherdata", JSON.stringify(weatherdata));
            displayweather(weatherdata);
        }
    )
}

if ("geolocation" in navigator) {
    let weatherdata = JSON.parse(localStorage.getItem("weatherdata"));

    if ((weatherdata === null) || (weatherdata.time <= ((Date.now() / 1000) - REFRESHTIME))) { // old or missing data
        if (weatherdata !== null) {
            displayweather(weatherdata); // display previously cached data if available
        }

        navigator.geolocation.getCurrentPosition((position) => {
            weather(
                round(position.coords.latitude, 2),
                round(position.coords.longitude, 2)
            );
        });
    }
    else {
        displayweather(weatherdata); // display cached data
    }
}
else {
    console.log("WARNING: geolocation not available in navigator");
}

// refresh every REFRESHTIME seconds and ping the API
setInterval(() => {
    navigator.geolocation.getCurrentPosition((position) => {
        weather(
            round(position.coords.latitude, 2),
            round(position.coords.longitude, 2)
        );
    });
}, REFRESHTIME * 1000);

// if another tab updates, display the update
addEventListener("storage", (event) => {
    displayweather(JSON.parse(localStorage.getItem("weatherdata")));
});