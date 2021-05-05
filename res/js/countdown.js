let aC = null;
let countdownOnIndex = -1;
let start;
const duranceSec = 3;
const duranceMillis = duranceSec*1000;

function startCountdownAnimation() {
    if(aC !== null){
        return;
    }
    startAnimation();
    aC = setTimeout('stopCountdownAnimation(true)', duranceMillis);
}

function startAnimation(){
    const playerIndex = app.gameState.game.currentPlayerIndex;
    countdownOnIndex = playerIndex;
    startAnimationOn(`#players .player .current.index${playerIndex} > .turnBar`);
    if(isMyTurn()){
        startAnimationOn(`#ownCards > .current > .turnBar`);
    }
}

function resetAnimation(){
    const playerIndex = countdownOnIndex;
    if(playerIndex === -1 || app.currentView !== 'running'){
        return;
    }
    resetAnimationOn(`#players .player .current.index${playerIndex} > .turnBar`);
    if(isMe(playerIndex)){
        resetAnimationOn(`#ownCards > .current > .turnBar`);
    }
    countdownOnIndex = -1;
}

function startAnimationOn(selector){
    const turnBar = document.querySelector(selector);
    turnBar.style.transition = `width ${duranceSec}s linear`;
    turnBar.style.width = '0%';
}

function resetAnimationOn(selector){
    const turnBar = document.querySelector(selector);
    turnBar.style.transition = '';
    turnBar.style.width = '100%';
}

function stopCountdownAnimation(nextTurn){
    setTimeout('resetAnimation()', 50);
    if(aC !== null){
        clearTimeout(aC);
        aC = null;
    }
    if(nextTurn){
        next();
    }
}
