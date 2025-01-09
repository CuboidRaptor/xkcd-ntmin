function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

let weatherdata;

function displayweather(wobj) {
    console.log(wobj);
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
            localStorage.setItem("xkcd-ntmin-wd", JSON.stringify(weatherdata));
            displayweather(weatherdata);
        }
    )
}

if ("geolocation" in navigator) {
    weatherdata = JSON.parse(localStorage.getItem("xkcd-ntmin-wd"));

    if (weatherdata === null) {
        navigator.geolocation.getCurrentPosition((position) => {
            weather(
                round(position.coords.latitude, 2),
                round(position.coords.longitude, 2)
            );
        });
    }
}
else {
    console.log("geolocation not available in navigator");
}