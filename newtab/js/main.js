function round(n, d) {
    return Math.round((n + Number.EPSILON) * (10 ** d)) / (10 ** d);
}

function displayxkcd(data) {
    let title = document.getElementById("xkcdtitle");
    let img = document.getElementById("xkcdimg");
    let link = document.getElementById("xkcdlink");

    title.innerHTML = data.title;
    img.src = data.img;
    img.title = data.alt;
    link.href = `https://xkcd.com/${data.num}`;
    link.innerHTML = "xkcd.com";

    console.log("DEBUG: XKCD display refreshed")
}

function getxkcd(num=null) {
    let comicdata = JSON.parse(localStorage.getItem("xkcddata"));
    let unixday = Math.floor(Date.now() / 86400000);

    if ((comicdata === null) || (comicdata.fetchday < unixday)) {
        // null represents latest xkcd
        console.log("DEBUG: Sending message to background mirror/xkcd API...");
        chrome.runtime.sendMessage("xkcdntmin@cuboidraptor.github.io", {value: num}, (response) => {
            // get latest information
            if (!response.success) {
                throw new Error("Background script xkcd API mirror returned failure");
            }
            if (parseInt(response.data.day) === new Date().getUTCDate()) {
                getxkcd(num=response.data.num - 1); // get older and older comics until we can confirm published before today
                return;
            }
            let comic = randint(unixday, 1, response.data.num + 1); // randint from prng.js

            chrome.runtime.sendMessage("xkcdntmin@cuboidraptor.github.io", {value: comic}, (res) => {
                if (!res.success) {
                    throw new Error("Background script xkcd API mirror returned failure");
                }

                localStorage.setItem("xkcddata", JSON.stringify({
                    fetchday: unixday,
                    data: res.data
                }));
                displayxkcd(res.data);
            });
        });
    }
    else {
        displayxkcd(comicdata.data);
    }
}

function xkcdevent() { // check new xkcd 30 secs after start of every UTC day
    setTimeout(() => {
        getxkcd();
        xkcdevent();
    }, (Math.ceil(Date.now() / 86400000) * 86400000 + 30000) - Date.now())
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

getxkcd();
checkWeather();
xkcdevent();

// refresh every REFRESHTIME seconds and ping the API if necessary
setInterval(checkWeather, REFRESHTIME * 1000);

// if another tab updates, display the update
addEventListener("storage", (event) => {
    console.log("DEBUG: localStorage changed detected, syncing data...");
    displayweather(JSON.parse(localStorage.getItem("weatherdata")));
    displayxkcd(JSON.parse(localStorage.getItem("xkcddata")).data);
});
