(function () {
    let jobDetail = {}
    // get job name
    let jobName = document.getElementsByClassName("name");
    if (jobName != undefined) {
        try {
            jobDetail.name = `${jobName[0].children[0].textContent.trim()}-${jobName[0].children[1].textContent.trim()}`;
        } catch (e) { }
    }
    // get job location
    let jobLocation = document.getElementsByClassName("job-location-map js-open-map");
    if (jobLocation != undefined) {
        try {
            let xy = /A:(\d+\.\d+),(\d+\.\d+)&/.exec(jobLocation[0].children[0].src);
            jobDetail.pointx = xy[1];
            jobDetail.pointy = xy[2];
        } catch (e) { }
    }
    if (jobDetail != {}) {
        jobListPush(jobDetail);
    }
})();


function jobListPush(jobDetail) {
    chrome.storage.local.get({ jobs: [] }, function (result) {
        let jobList = result.jobs;
        while (jobList.length >= 10) {
            jobList.shift();
        }
        jobList.push(jobDetail);
        chrome.storage.local.set({ jobs: jobList });
    });
}
