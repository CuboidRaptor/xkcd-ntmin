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

    console.log("DEBUG: XKCD display refreshed")
}


function xkcdEvent() { // check new xkcd 30 secs after start of every UTC day
    setTimeout(() => {
        getxkcd();
        xkcdEvent();
    }, (Math.ceil(Date.now() / 86400000) * 86400000 + 30000) - Date.now())
}

// check image height whenever it loads
document.getElementById("xkcdimg").addEventListener("load", imgHeightCheck);

chrome.runtime.sendMessage(chrome.runtime.id, {}, (response) => {displayxkcd(response.data)});
//xkcdEvent();

addEventListener("resize", imgHeightCheck);
