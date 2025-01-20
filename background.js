// thanks to GitHub user bryc for like all of this randint code
function cyrb53_64(str, seed=0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;

    for(let i = 0, ch; i < str.length; i++) {
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
    max -= blocked.length;
    let value = Math.floor(mulberry32(cyrb53_64(seed.toString())[0]) * (max - min) + min);

    for (let i = 0; i < blocked.length; i++) {
        if (value >= blocked[i]) {
            value++;
        }
    }

    return value;
}

// </randint stuff>
// actual code for XKCD fetching and stuff!!!

let init = false; // prevent data being fetched before initilization
let comicData = {};

function getXKCD(num, callback, time) {
    let url_part = "";

    if (num !== null) { // null means latest
        url_part = num.toString() + "/";
    }

    fetch(`https://xkcd.com/${url_part}info.0.json`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(`XKCD API fetch failed with status ${response.status}`);
            }
            return response.json();
        }
    ).then((data) => {callback(data, time)});
}

function xkcdChecker(data, time) {
    if (parseInt(data.day) === time.utcDay) {
        getXKCD(data.num - 1, xkcdChecker); // get older and older comics until we can confirm published before today
        return;
    }
    let comic = randint(time.unixDay, 1, data.num + 1, [1608, 2916]);

    getXKCD(comic, (data) => {
        comicData = {fetchDay: time.unixDay, data: data}

        if (!init) { // set listener, but only the first time
            init = true;
            chrome.runtime.onMessage.addListener((_request, sender, sendResponse) => {
                if (sender.id !== chrome.runtime.id) {
                    console.log("WARNING: different id/origin xkcd API mirror request blocked");
                    sendResponse({success: false});
                    return false;
                }

                sendResponse(comicData);
            });
        }
    });
}

getXKCD(null, xkcdChecker, {
    unixDay: Math.floor(Date.now() / 86400000),
    utcDay: new Date().getUTCDate()
});