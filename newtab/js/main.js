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
    let imgDiv = document.getElementById("imgdiv");
    let link = document.getElementById("xkcdlink");

    title.innerHTML = data.title;
    link.href = `https://xkcd.com/${data.num}`;
    link.innerHTML = "xkcd.com";
    imgDiv.classList.remove("divinitial");
    img.src = data.img;
    img.title = data.alt;

    console.log("DEBUG: XKCD display refreshed");
}

// check image height whenever it loads
document.addEventListener("resize", imgHeightCheck);
document.getElementById("xkcdimg").addEventListener("load", imgHeightCheck);

chrome.storage.local.get("comicData").then((data) => {
    if (data.comicData !== undefined) {
        displayxkcd(data.comicData.data);
    }
    else {
        console.log("WARNING: Undefined received from chrome.storage.local");
    }
});

