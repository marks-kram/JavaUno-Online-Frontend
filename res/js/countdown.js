let aC = null;
let start;

function animateCountdown(){
    const now = new Date().getTime();
    let diff = now-start;

    if(diff > config.backendCountdownLength){
        diff = config.backendCountdownLength;
    }

    app.timeLeftPercent = 100 - 100/config.backendCountdownLength*diff;

    if(app.timeLeftPercent <= 0){
        stopCountdownAnimation(false);
        if(isMyTurn()){
            next();
        }
    }
}

function startCountdownAnimation() {
    start = new Date().getTime();
    aC = setInterval('animateCountdown()', 10);
}

function stopCountdownAnimation(nextTurn){
    if(aC !== null){
        clearInterval(aC);
        aC = null;
    }
    app.timeLeftPercent = nextTurn ? 100 : 0;
}
