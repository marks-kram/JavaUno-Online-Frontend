let stompClient = null;
let wasConnected = false;
let cC;

function checkConnected(){
    const connected = stompClient !== null && stompClient.connected !== undefined && stompClient.connected;
    if(connected){
        wasConnected = connected;
    } else {
        if(wasConnected){
            clearInterval(cC);
            self.location.reload();
        }
    }
}

cC = setInterval('checkConnected()', 1000);

function connectPush(gameUuid) {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/api/push/'+gameUuid, function (message) {
            handleMessage(message);
        });
    });
}

async function handleMessage(message){
    let waitFor = 0;
    while(joinGameRunning){
        waitFor++;
        await sleep();
    }
    console.log('Wait for joinGame to be finished for ' + waitFor + ' times');
    doPushActions(message);
}

function doPushActions(message){
    const messageType = message.body.replace(/:.*$/, '');
    pushActions[messageType](message);
}

const doPushActionStartedGame = function(){
    app.gameState.game.gameLifeCycle = 'RUNNING';
    app.timeLeftPercent = 100;
    app.winner = -1;
    showToast('Es geht los');
    updateView();
};

const doPushActionAddedPlayer = function(message){
    if(message.body.startsWith('added-player')){
        const index = parseInt(message.body.replace(/^added-player:(\d).*$/, '$1'));
        if(isNotMe(index)){
            let name = message.body.replace(/^added-player:\d:(.*)$/, '$1');
            name = getPlayerName(name, index);
            showToast(name + ' macht mit');
        }
    }
    updateView();
};

const  doPushActionRemovedPlayer = function(message){
    if(message.body.startsWith('removed-player')){
        const index = parseInt(message.body.replace(/removed-player:/, ''));
        if(isNotMe(index)){
            let name = app.gameState.players[index].name;
            name = getPlayerName(name, index).replace(/^Spieler\s+(\d+)$/, 'Der ehemalige Spieler $1');
            showToast(name + ' ist gegangen');
        }
        if(isNotMe(index) || app.currentView === 'join'){
            app.gameState.players.splice(index, 1);
        }
    }
};

const doPushActionPutCard = function(message){
    if(app.gameState.game.gameLifeCycle === 'RUNNING') {
        if(!message.body.endsWith(':joker') && app.gameState.players[app.gameState.game.currentPlayerIndex].cardCount > 0){
            startCountdown();
        }
    }
    if(app.currentView === 'running'){
        updateView();
    }
};

const doPushActionDrawnCard = function(message){
    if(app.currentView === 'running') {
        if(message.body.endsWith(':countdown')){
            startCountdown();
        }
        updateView();
    }
};

const doPushActionKeptCard = function(){
    if(app.currentView === 'running') {
        startCountdown();
    }
};

const doPushActionSelectedColor = function(message){
    if(app.currentView === 'running') {
        if(!isMyTurn()){
            app.gameState.game.desiredColor = message.body.replace(/selected-color:/, '');
        }
        startCountdown();
    }
};

const doPushActionSaidUno = function(){
    if(app.currentView === 'running'){
        const index = app.gameState.game.currentPlayerIndex;
        if(!isMyTurn()){
            let name = app.gameState.players[index].name;
            name = getPlayerName(name, index);
            showToast(name + ': „Uno“');
        } else {
            showToast('Du : „Uno“');
        }
        app.gameState.players[index].unoSaid = true;
    }
};

const doPushActionNextTurn = function(message){
    if(app.currentView === 'running'){
        app.gameState.game.turnState = '';
        stopCountdownAnimation(true);
        const index = parseInt(message.body.replace(/next-turn:/, ''));
        app.gameState.game.currentPlayerIndex = index;
        let name = app.gameState.players[index].name;
        name = getPlayerName(name, index);
        if(isMyTurn()){
            showToast('Du bist dran, ' + name);
        } else {
            showToast(name + ' ist dran');
        }
    }
    updateView();
};

const  doPushActionFinishedGame = function() {
    app.gameState.game.gameLifeCycle = 'SET_PLAYERS';
    if(app.currentView === 'running'){
        app.winner = app.gameState.game.currentPlayerIndex;
    }
};

const  doPushActionEnd = function() {
    showToast('Spiel beendet. Danke für\'s Spielen');
    reset();
};

function startCountdown(){
    if(app.currentView === 'running' && aC === null){
        aC = 0;
        app.gameState.game.turnState = 'FINAL_COUNTDOWN';
        startCountdownAnimation();
    }
}

function updateView(){
    if(app.playerUuid !== ''){
        loadGame();
    } else {
        loadGameWithoutPlayer();
    }
}

const pushActions = {
    'started-game': doPushActionStartedGame,
    'added-player': doPushActionAddedPlayer,
    'removed-player': doPushActionRemovedPlayer,
    'put-card': doPushActionPutCard,
    'drawn-card': doPushActionDrawnCard,
    'kept-card': doPushActionKeptCard,
    'selected-color': doPushActionSelectedColor,
    'said-uno': doPushActionSaidUno,
    'next-turn': doPushActionNextTurn,
    'finished-game': doPushActionFinishedGame,
    'end': doPushActionEnd
};