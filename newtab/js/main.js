function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

function displayxkcd(data) {
    let title = document.getElementById("xkcdtitle");
    let img = document.getElementById("xkcdimg");
    let link = document.getElementById("xkcdlink");

    title.innerHTML = data.title;
    link.href = `https://xkcd.com/${data.num}`;
    link.innerHTML = "xkcd.com";
    img.src = data.img;
    img.title = data.alt;

    console.log("DEBUG: XKCD display refreshed")
}

function getxkcd(num=null) {
    let comicData = JSON.parse(localStorage.getItem("xkcddata"));
    let unixDay = Math.floor(Date.now() / 86400000);

    if ((comicData === null) || (comicData.fetchDay < unixDay)) {
        // null represents latest xkcd
        console.log("DEBUG: Sending message to background mirror/xkcd API...");
        chrome.runtime.sendMessage(chrome.runtime.id, {value: num}, (response) => {
            // get latest information
            if (!response.success) {
                throw new Error("Background script xkcd API mirror returned failure");
            }
            if (parseInt(response.data.day) === new Date().getUTCDate()) {
                getxkcd(num=response.data.num - 1); // get older and older comics until we can confirm published before today
                return;
            }
            let comic = randint(unixDay, 1, response.data.num + 1, [1608, 2916]); // randint from prng.js
                // list of blocked comics at the end as they are web games that I am too lazy to embed

            chrome.runtime.sendMessage(chrome.runtime.id, {value: comic}, (res) => {
                if (!res.success) {
                    throw new Error("Background script xkcd API mirror returned failure");
                }

                localStorage.setItem("xkcddata", JSON.stringify({
                    fetchDay: unixDay,
                    data: res.data
                }));
                displayxkcd(res.data);
            });
        });
    }
    else {
        displayxkcd(comicData.data);
    }
}

function xkcdEvent() { // check new xkcd 30 secs after start of every UTC day
    setTimeout(() => {
        getxkcd();
        xkcdEvent();
    }, (Math.ceil(Date.now() / 86400000) * 86400000 + 30000) - Date.now())
}

const REFRESHTIME = 60 * 30; // time in seconds of weather refresh, default is half an hour
let listener = false; // listener that updates weather on focus

function displayWeather(weatherData) {
    let feelsLike = document.getElementById("wmo"); // display p's based on font size
    let other = document.getElementById("other");
    let iconSpan = document.getElementById("wmoiconspan");
    let icon = document.getElementById("wmoicon");
    let curWMO = wcjson[weatherData.weather_code][{0: "night", 1: "day"}[weatherData.is_day]]; // wcjson is from wmocodes.js

    feelsLike.innerHTML = `${curWMO.description}`
    other.innerHTML = `Feels like <b>${weatherData.apparent_temperature}°</b><br>
Temp: <b>${weatherData.temperature_2m}°</b><br>
Humidity: <b>${weatherData.relative_humidity_2m}%</b><br>
Chance of Rain: <b>${weatherData.precipitation_probability}%</b><br>`
    iconSpan.style.height = "64px"
    icon.src = "https://openweathermap.org/img/wn/" + curWMO.image;
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
            weatherData = {...data.daily, ...data.current};
            localStorage.setItem("weatherdata", JSON.stringify(weatherData));
            displayWeather(weatherData);
            console.log("DEBUG: Weather data fetched!");
            console.log(`DEBUG: Weather data last updated at ${weatherData.time}`);
        }
    )
}

function checkWeather() {
    // check if weather cached, otherwise fetch new
    if (document.hidden) {
        if (!listener) {
            listener = true;
            document.addEventListener("visibilitychange", visCheck);
            console.log("DEBUG: visibilitychange event listener set");
        }
    }
    else {
        if (!("geolocation" in navigator)) {
            // geolocation unavailable
            console.log("WARNING: geolocation not available in navigator");
            return;
        }

        let weatherData = JSON.parse(localStorage.getItem("weatherdata"));

        if (weatherData !== null) {
            // data exists
            displayWeather(weatherData); // display cached data
            if (weatherData.time > (Date.now() / 1000 - REFRESHTIME)) {
                // data is recent
                return;
            }
        }

        document.getElementById("updating").innerHTML = "Updating...";
        navigator.geolocation.getCurrentPosition((position) => {
            weather(
                round(position.coords.latitude, 2),
                round(position.coords.longitude, 2)
            );
        }, (error) => {
            throw new Error(`code ${error.code}, ${error.message}`);
        }, {timeout: 15000});
    }
}

function visCheck() {
    if (!document.hidden) {
        checkWeather();
        document.removeEventListener("visibilitychange", visCheck);
        listener = false;
    }
}

getxkcd();
checkWeather();
xkcdEvent();

// refresh every REFRESHTIME seconds and ping the API if necessary
setInterval(checkWeather, REFRESHTIME * 1000);

// if another tab updates, display the update
addEventListener("storage", (event) => {
    console.log("DEBUG: localStorage changed detected, syncing data...");
    displayWeather(JSON.parse(localStorage.getItem("weatherdata")));
    displayxkcd(JSON.parse(localStorage.getItem("xkcddata")).data);
});
