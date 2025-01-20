function imgHeightCheck() {
    let img = document.getElementById("xkcdimg");

    if (img.naturalHeight > window.innerHeight) {
        img.style.maxHeight = "";
    }
    else {
        img.style.maxHeight = "75vh";
    }
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

    imgHeightCheck();

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
            comic = 497 // comic override

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

getxkcd();
xkcdEvent();

addEventListener("resize", imgHeightCheck);

// if another tab updates, display the update
addEventListener("storage", (event) => {
    console.log("DEBUG: localStorage changed detected, syncing data...");
    displayxkcd(JSON.parse(localStorage.getItem("xkcddata")).data);
});
