var interval;

// notification
function simpleNotify(diff) {
    /*
        @diff: 这次打开与上一次打开时的粉丝数之差
    */
    if (diff > 0) {
        title = "粉丝数增长辣！增长了 " + diff + "个";
    } else if (diff == 0) {
        title = "粉丝数！它没变！嘻嘻";
    } else if (diff < 0) {
        title = "粉丝数减少辣！减少了 " + diff + "个";
    }
    document.getElementById("notify").innerText = title;
}

function notificationDiffFollower(newFollower) {
    chrome.storage.sync.get("follower", function (result) {
        if (result) {
            let diff = newFollower - result.follower;
            simpleNotify(diff);
        }
    })
}

// set some event
function setSpaceIDEvent() {
    document.getElementById("setSpaceID").onclick = function () {
        let spaceIDdocObj = document.getElementById("spaceID");
        if (spaceIDdocObj.value) {
            chrome.storage.sync.set({ "spaceid": spaceIDdocObj.value });
            renderInfo(spaceIDdocObj.value);
        }
    }
}

function setUrlClickEvent() {
    var aDivs = ["upSpaceUrl", "2er0Xbug"];
    for (i = 0; i < aDivs.length; i++) {
        let aDocObj = document.getElementById(aDivs[i]);
        aDocObj.onclick = function () {
            chrome.tabs.create({
                url: aDocObj.href,
                active: true,
                pinned: false
            });
        }
    }
}

// render
function renderUpName(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            document.getElementById("upName").innerText = xhr.responseText.match(/<title>(\s*\S*)的个人空间/)[1];
        }
    }
    xhr.send();
}

function renderFansNum(spaceid, isinit) {
    let api = "https://api.bilibili.com/x/relation/stat?vmid=" + spaceid + "&jsonp=jsonp";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", api, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            resp_json = JSON.parse(xhr.responseText);
            if (resp_json.code === 0) {
                document.getElementById("fansNum").value = resp_json.data.follower;
                if (isinit) {
                    notificationDiffFollower(resp_json.data.follower);
                    chrome.storage.sync.set({ "follower": resp_json.data.follower });
                }
            }
        }
    }
    xhr.send();
}

function showFansNum(spaceid, sec = 1.5) {
    renderFansNum(spaceid, true);
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(function () {
        renderFansNum(spaceid);
    }, sec * 1000);
}

function renderInfo(spaceid) {
    let upSpaceUrl = "https://space.bilibili.com/" + spaceid + "/#/";
    document.getElementById("upSpaceUrl").href = upSpaceUrl;
    renderUpName(upSpaceUrl);
    showFansNum(spaceid);
}

function renderFromStorage() {
    chrome.storage.sync.get("spaceid", function (result) {
        if (result.spaceid) {
            document.getElementById("spaceID").value = result.spaceid;
            renderInfo(result.spaceid);
        }
    });
}


// main
setSpaceIDEvent();
setUrlClickEvent();
renderFromStorage();