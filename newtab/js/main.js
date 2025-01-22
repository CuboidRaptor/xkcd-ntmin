const resizeFactor = 1.2 // multiple of screen height that image has to be
    // before it gets scrolled

function imgHeightCheck() {
    let img = document.getElementById("xkcdimg");
    let imgDiv = document.getElementById("imgdiv");

    if (img.naturalHeight > (window.innerHeight * resizeFactor)) {
        imgDiv.style.overflow = "auto";
        img.style.maxHeight = "";
    }
    else {
        imgDiv.style.overflow = "hidden";
        img.style.maxHeight = "75vh";
    }
}

function displayXKCD(data) {
    chrome.storage.local.get("comicData").then(function(data) {
        if (data !== {}) {
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
window.addEventListener("resize", imgHeightCheck);
document.getElementById("xkcdimg").addEventListener("load", imgHeightCheck);

chrome.storage.local.onChanged.addListener(() => {
    console.log("DEBUG: chrome.storage.local change detected, refreshing xkcd display...");
    displayXKCD();
})
displayXKCD();

