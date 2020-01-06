let aC;
let start;

function animateCountdown(){
    const now = new Date().getTime();
    let diff = now-start;

    if(diff > config.backendCountdownLength){
        diff = config.backendCountdownLength;
    }

    app.timeLeftPercent = 100 - 100/config.backendCountdownLength*diff;

    if(app.timeLeftPercent <= 0){
        app.timeLeftPercent = 0;
        clearInterval(aC);
    }
}

function startCountdownAnimation() {
    start = new Date().getTime();
    aC = setInterval('animateCountdown()', 10);
}
