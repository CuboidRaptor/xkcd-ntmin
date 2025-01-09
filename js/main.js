function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

const REFRESHTIME = 60 * 30 // time in seconds of weather refresh, default is half an hour

function displayweather(weatherdata) {
    let weatherelem = document.getElementById("weather");
    weatherelem.innerHTML = `Feels like ${weatherdata.apparent_temperature}°`
}

function weather(lat, long) {
    fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}\
&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timeformat=unixtime`
    ).then(
        (response) => (response.json())
    ).then(
        (data) => {
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
    console.log("geolocation not available in navigator");
}