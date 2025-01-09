function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

const REFRESHTIME = 60 * 30 // time in seconds of weather refresh, default is half an hour

function displayweather(weatherdata) {
    let feelslike = document.getElementById("feelslike"); // display p's based on font size
    let other = document.getElementById("other");

    feelslike.innerHTML = `Feels like <b>${weatherdata.apparent_temperature}°</b>`
    other.innerHTML = `Temp: <b>${weatherdata.temperature_2m}°</b><br>
Humidity: <b>${weatherdata.relative_humidity_2m}%</b><br>
Wind Speed: <b>${weatherdata.wind_speed_10m} km/h</b><br>
Chance of Rain: <b>${weatherdata.precipitation_probability}%</b><br>`
}

function weather(lat, long) {
    fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}\
&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability,weather_code\
&timeformat=unixtime`
    ).then(
        (response) => (response.json())
    ).then(
        (data) => {
            console.log("DEBUG: tried to fetch updated weather data")
            weatherdata = data.current;
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