function getLetter(index) {
    let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    return arr[index];
}

function getRandomColor() {
    var colorElements = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
    var colorArray = colorElements.split(",");
    var color = "0x";
    for (var i = 0; i < 6; i++) {
        color += colorArray[Math.floor(Math.random() * 16)];
    }
    return color;
}

function generateMarkers(jobs) {
    let sizex = 640;
    let sizey = 576;
    let zoom = 9;
    console.log(jobs);
    if (jobs.length !== 0) {
        let markers = [];
        let lables = [];
        for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].pointx == undefined || jobs[i].pointy == undefined) {
                continue
            }
            name = jobs[i].name.trim().replace(' ', '');
            if (name.length > 15) {
                name = name.substring(0, 15);
            }
            markers.push(`mid,${getRandomColor()},${getLetter(i)}:${jobs[i].pointx},${jobs[i].pointy}`);
            lables.push(`${name},2,0,16,0xFFFFFF,0x008000:${jobs[i].pointx},${jobs[i].pointy}`);
        }
        return `https://restapi.amap.com/v3/staticmap?size=${sizex}*${sizey}&zoom=${zoom}&markers=${markers.join("|")}&labels=${lables.join("|")}&key=21b56a6cc83fad7668dbb0e9564759a7`;
    } else {
        return "images/404.png";
    }
}

function makeJobMap(src) {
    return `<img src=${src}></img>`;
}

function renderMap() {
    chrome.storage.local.get({ jobs: [] }, function (result) {
        if (result.jobs) {
            let element = document.getElementById("locations");
            let url = generateMarkers(result.jobs);
            // document.getElementById("test-text").innerHTML = url;
            console.log(url);
            element.innerHTML = makeJobMap(url);
        }
    });
}
// main
renderMap();
document.getElementById("clear").onclick = function () {
    chrome.storage.local.set({ jobs: [] });
    renderMap();
}
