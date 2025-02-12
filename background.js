// thanks to GitHub user bryc for cyrb53-64 and mulberry32 js implementations
function cyrb53_64(str, seed=0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;

    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return [h2>>>0, h1>>>0];
};

function mulberry32(a) {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

function randint(seed, min, max, blocked=[]) {
    blocked.sort();
    max -= blocked.length; /* remove shrink range by length of blocked and then
        shift over numbers equal or larger than blocked values so the maximum value
        still lines up */
    let value = Math.floor(mulberry32(cyrb53_64(seed.toString())[0]) * (max - min) + min);

    for (let blockedNum of blocked) {
        if (value >= blockedNum) {
            value++;
        }
    }

    return value;
}

// </randint stuff>
// actual code for XKCD fetching and stuff!!!

function getXKCD(num, callback, time) {
    // ping xkcd api for num comic, then run callback
    let url_part = "";

    if (num !== null) { // null means latest
        url_part = num.toString() + "/";
    }

    let url = `https://xkcd.com/${url_part}info.0.json`

    console.log(`DEBUG: Fetching ${url} ...`)

    fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`XKCD API fetch failed with status ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        callback(data, time)
    });
}

function xkcdChecker(data, time) {
    // find the right xkcd latest, then generate today's comic and fetch/push to chrome.storage.session
    if (parseInt(data.day) === time.utcDay) {
        getXKCD(data.num - 1, xkcdChecker, time); // get older and older comics until we can confirm published before today
        return;
    }
    let comic = randint(time.unixDay, 1, data.num + 1, [1525, 1608, 2916]);
    //comic = 1732; // override for random comic/debug purposes

    getXKCD(comic, (data, time) => {
        chrome.storage.session.set({comicData: {fetchDay: time.unixDay, data: data}});
    }, time);
}

function checkNewXKCD() {
    // new tab loaded, check if new xkcd is needed
    let time = {
        unixDay: Math.floor(Date.now() / 86400000),
        utcDay: new Date().getUTCDate()
    };
    chrome.storage.session.get("comicData").then(function(data) {
        if ((Object.keys(data).length === 0) || (data.comicData.fetchDay < time.unixDay)) {
            console.log("DEBUG: Tab-pinged, comic expired, getting new xkcd...");
            getXKCD(null, xkcdChecker, time);
        }
    });
}

chrome.runtime.onMessage.addListener(checkNewXKCD);
checkNewXKCD();
