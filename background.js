chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id) {
        console.log("WARNING: different id/origin xkcd API mirror request blocked");
        sendResponse({success: false});
        return false;
    }

    if ((typeof request.value !== "number") && (request.value !== null)) { // null represents latest xkcd
        // invalid type
        console.log("WARNING: Non-int/null value for request blocked");
        sendResponse({success: false});
        return false;
    }

    let url_part = "";

    if (request.value !== null) {
        url_part = request.value.toString() + "/";
    }

    fetch(`https://xkcd.com/${url_part}info.0.json`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(`XKCD API fetch failed with status ${response.status}`);
            }
            return response.json();
        }
    ).then(
        (data) => {
            sendResponse({success: true, data: data});
        }
    )

    return true;
});