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

function displayXKCD() {
    chrome.storage.session.get("comicData").then(function(data) {
        if (Object.keys(data).length === 0) {
            console.log("WARNING: Undefined received from chrome.storage.session");
            return;
        }

        console.log("DEBUG: XKCD display refreshing...");
        
        let title = document.getElementById("xkcdtitle");
        let img = document.getElementById("xkcdimg");
        let imgDiv = document.getElementById("imgdiv");
        let link = document.getElementById("xkcdlink");
        let exlink = document.getElementById("explainxkcdlink");
        let transcriptDiv = document.getElementById("transcript");
        let cData = data.comicData.data;

        title.innerHTML = cData.title;
        imgDiv.classList.remove("divinitial"); // add placeholder box that will be removed when image loads
        link.href = `https://xkcd.com/${cData.num}`;
        link.innerHTML = "xkcd.com";
        exlink.href = `https://www.explainxkcd.com/wiki/index.php/${cData.num}`;
        exlink.innerHTML = "explainxkcd";
        transcriptDiv.innerHTML = cData.transcript;

        if (cData.num === 1525) {
            console.log("DEBUG: Comic 1525");
        }
        else {
            img.src = cData.img;
            img.title = cData.alt;
        }
    });
}

// check image height whenever it loads
window.addEventListener("resize", imgHeightCheck);
document.getElementById("xkcdimg").addEventListener("load", imgHeightCheck);

chrome.storage.session.onChanged.addListener(() => {
    console.log("DEBUG: chrome.storage.session change detected, refreshing xkcd display...");
    displayXKCD();
})
displayXKCD();

// check if new xkcd is needed/expired, if so, ping the background script
let unixDay = Math.floor(Date.now() / 86400000);
chrome.storage.session.get("comicData").then(function(data) {
    if ((Object.keys(data).length === 0) || (data.comicData.fetchDay < unixDay)) {
        console.log("DEBUG: Comic expired, getting new xkcd...");
        chrome.runtime.sendMessage({}); // send empty message to background so it updates xkcd
    }
});

// permissions button stuff vvvvvvvv
function permsCheck(clicked=false) {
    chrome.permissions.contains({origins: ["https://xkcd.com/*"]}).then((granted) => {
        if (granted) {
            document.getElementById("permsbutton").style.display = "none";

            if (clicked) {
                chrome.runtime.sendMessage(chrome.runtime.id, {}); // only one action ever needs to be performed
                    // via sendMessage so any request will result in background simply refetching xkcd
            }
        }
        else {
            document.getElementById("permsbutton").style.display = "initial";
        }
    });
}

function permsButtonClicked() {
    chrome.permissions.request({origins: ["https://xkcd.com/*"]}).then(() => {permsCheck(true);});
}

document.getElementById("permsbutton").addEventListener("click", permsButtonClicked);
permsCheck();
