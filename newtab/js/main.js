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
    chrome.storage.local.get("comicData").then(function(data) {
        if (!data.isEmpty()) {
            console.log("DEBUG: XKCD display refreshing...");
            
            let title = document.getElementById("xkcdtitle");
            let img = document.getElementById("xkcdimg");
            let imgDiv = document.getElementById("imgdiv");
            let link = document.getElementById("xkcdlink");
            let exlink = document.getElementById("explainxkcdlink");
            let cData = data.comicData.data;

            title.innerHTML = cData.title;
            imgDiv.classList.remove("divinitial"); // add placeholder box that will be removed when image loads
            img.src = cData.img;
            img.title = cData.alt;
            link.href = `https://xkcd.com/${cData.num}`;
            link.innerHTML = "xkcd.com";
            exlink.href = `https://www.explainxkcd.com/wiki/index.php/${cData.num}`;
            exlink.innerHTML = "explainxkcd";
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
