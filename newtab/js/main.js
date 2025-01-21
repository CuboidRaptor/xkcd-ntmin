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
    chrome.storage.local.get("comicData").then((data) => {
        if (data.comicData !== undefined) {
            console.log("DEBUG: XKCD display refreshing...");
            let title = document.getElementById("xkcdtitle");
            let img = document.getElementById("xkcdimg");
            let imgDiv = document.getElementById("imgdiv");
            let link = document.getElementById("xkcdlink");
            let cData = data.comicData.data;

            title.innerHTML = cData.title;
            link.href = `https://xkcd.com/${cData.num}`;
            link.innerHTML = "xkcd.com";
            imgDiv.classList.remove("divinitial"); // add placeholder box that will be removed when image loads
            img.src = cData.img;
            img.title = cData.alt;
        }
        else {
            console.log("WARNING: Undefined received from chrome.storage.local");
        }
    });
}

// check image height whenever it loads
document.addEventListener("resize", imgHeightCheck);
document.getElementById("xkcdimg").addEventListener("load", imgHeightCheck);

chrome.storage.local.onChanged.addListener(() => {
    console.log("DEBUG: chrome.storage.local change detected, refreshing xkcd display...");
    displayxkcd();
})

