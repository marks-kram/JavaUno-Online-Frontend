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
    aC = setTimeout('next()', duranceMillis);
}

function startAnimation(){
    const playerIndex = app.gameState.game.currentPlayerIndex;
    countdownOnIndex = playerIndex;
    const uuid = app.gameState.players[playerIndex].publicUuid;
    startAnimationOn(`#players .player._${uuid} .current > .turnBar`);
    if(isMyTurn()){
        startAnimationOn(`#ownCards > .current > .turnBar`);
    }
}

function resetAnimation(){
    const playerIndex = countdownOnIndex;
    if(playerIndex === -1 || app.currentView !== 'running'){
        return;
    }
    const uuid = app.gameState.players[playerIndex].publicUuid;
    resetAnimationOn(`#players .player._${uuid} .current > .turnBar`);
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

function stopCountdownAnimation(){
    setTimeout('resetAnimation()', 50);
    if(aC !== null){
        clearTimeout(aC);
        aC = null;
    }
}
