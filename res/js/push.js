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

function connectPush(pushUuid, callback, callBackArgument) {
    if(stompClient != null){
        console.log('refuse to connect push. already connected.');
        return;
    }
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/api/push/'+pushUuid, function (message) {
            handleMessage(message);
        });
        if(callback != null){
            callback(callBackArgument);
        }
    });
}

function disconnectPush(){
    clearInterval(cC);
    stompClient.disconnect();
    stompClient = null;
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
    app.gameState.game.gameLifecycle = 'RUNNING';
    app.timeLeftPercent = 100;
    app.winner = -1;
    showTurnToast(app.gameState.game.currentPlayerIndex);
    showToast('Es geht los');
    updateView();
};

const doPushActionAddedPlayer = function(message){
    app.winner = -1;
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
    app.winner = -1;
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
        updateView();
    }
};

const doPushActionBotifiedPlayer = function(message){
    const index = parseInt(message.body.replace(/^botified-player:(.*?)$/, '$1'));
    if(isMe(index)){
        reset();
    } else {
        let name = app.gameState.players[index].name;
        name = name !== '' ? name : `Spieler ${index+1}`;
        app.gameState.players[index].bot = true;
        showInformationDialog(`${name} hat das Spiel verlassen und wurde zu einem Bot.`);
        updateView();
    }
};

const doPushActionPutCard = function(message){
    if(app.gameState.game.gameLifecycle === 'RUNNING') {
        const cardCount = app.gameState.players[app.gameState.game.currentPlayerIndex].cardCount - 1;
        if(!message.body.endsWith(':joker') && cardCount > 0){
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
    if(app.currentView === 'running' || app.previousView === 'running'){
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
    if(app.currentView === 'running' || app.previousView === 'running'){
        app.gameState.game.turnState = '';
        stopCountdownAnimation(true);
        const index = parseInt(message.body.replace(/next-turn:/, ''));
        app.gameState.game.currentPlayerIndex = index;
        showTurnToast(index);
    }
    updateView();
};

const  doPushActionFinishedGame = function(message) {
    const party = parseInt(message.body.replace(/finished-game:/, ''));
    if(app.currentView === 'running' && party === app.gameState.game.party){
        app.winner = app.gameState.game.currentPlayerIndex;
    }
    app.stopPartyRequested = false;
    updateView();
};

const  doPushActionEnd = function() {
    showToast('Spiel beendet. Danke für\'s Spielen');
    reset();
};

const  doPushActionSwitchIn = function(message) {
    const gameUuid = message.body.replace(/switch-in:([^:]+):([^:]+)$/, '$1');
    const playerUuid = message.body.replace(/switch-in:([^:]+):([^:]+)$/, '$2');
    if(app.pendingSwitch){
        localStorage.setItem('gameUuid', gameUuid);
        localStorage.setItem('playerUuid', playerUuid);
        doPostRequest(`/switch/switch-finished/${gameUuid}/${playerUuid}`, {}, function(){self.location.reload()});
    }
};

const  doPushActionSwitchFinished = function(message) {
    app.pendingPlayerIndex = parseInt(message.body.replace(/switch-finished:/, ''));
    const path = `/gameState/get/${app.gameUuid}/${app.playerUuid}`;
    doGetRequest(path, removeSwitchedGameFromHere);
};

const doPushActionRequestStopParty = function(message){
    const index = parseInt(message.body.replace(/^request-stop-party:(.*?)$/, '$1'));
    app.gameState.players[index].stopPartyRequested = true;
    let name = app.gameState.players[index].name;
    name = getPlayerName(name, index);
    if(isNotMe(index)){
        showToast(`${name} hat angefragt, diese Runde zu beenden.`);
    }
};

const doPushActionRevokeRequestStopParty = function(message){
    const index = parseInt(message.body.replace(/^revoke-request-stop-party:(.*?)$/, '$1'));
    app.gameState.players[index].stopPartyRequested = false;
    let name = app.gameState.players[index].name;
    name = getPlayerName(name, index);
    if(isNotMe(index)) {
        showToast(`${name} hat die Anfrage zurück genommen, diese Runde zu beenden.`);
    }
};

const doPushActionStopParty = function(message){
    const party = parseInt(message.body.replace(/stop-party:/, ''));
    if(app.currentView === 'running' && party === app.gameState.game.party){
        app.currentView = 'set-players';
        app.previousView = '';
        updateView();
    }
    if(app.previousView === 'running' && party === app.gameState.game.party){
        app.previousView = 'set-players';
    }
    app.stopPartyRequested = false;
};

const doPushActionRequestBotifyPlayer = function (message){
    const uuid = message.body.replace(/request-botify-player:/, '');
    if(app.playerUuid === uuid){
        showTimedCancelDialog(`Jemand möchte dich aus dem Spiel entfernen. 
        Ist das für dich ok? Du hast 10 Sekunden Zeit, diesen Vorgang abzubrechen.`, cancelBotify, 10);
    }
    updateView();
};

const doPushActionCancelBotifyPlayer = function (message){
    const uuid = message.body.replace(/cancel-botify-player:/, '');
    const pendingUuid = app.playerToBotify != null ? app.playerToBotify.publicUuid : '';
    if(pendingUuid === uuid){
        app.botifyPlayerPending = false;
        app.playerToBotify = null;
        showInformationDialog('Der Spieler hat den Prozess abgebrochen.');
    }
    updateView();
};

const doPushActionChatMessage = function (message){
    const playerPublicUuid = message.body.replace(/chat-message:([^:]+):(.+)$/, '$1');
    const content = message.body.replace(/chat-message:([^:]+):(.+)$/, '$2');
    const messageData = {
        playerPublicUuid: playerPublicUuid,
        content: content
    }
    app.gameState.game.messages.push(messageData);
    if(app.gameState.players[app.gameState.myIndex].publicUuid !== playerPublicUuid){
        const name = getPlayerNameByPublicUuid(playerPublicUuid);
        showToast(`${name} schreibt: ${content}`);
    }
    if(app.currentView === 'chat'){
        setReadMessages();
        setTimeout('updateChatView()', 200);
    }
};

function showTurnToast(index){
    let name = app.gameState.players[index].name;
    name = getPlayerName(name, index);
    if(isMyTurn()){
        showToast('Du bist dran, ' + name);
    } else {
        showToast(name + ' ist dran');
    }
}

function startCountdown(){
    if(app.currentView === 'running' && aC === null){
        aC = 0;
        app.gameState.game.turnState = 'FINAL_COUNTDOWN';
        startCountdownAnimation();
    }
}

function updateView(){
    if(app.currentView === 'chat' || app.currentView === 'switch-device'){
        stopProcessingAnimation();
        return;
    }
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
    'botified-player': doPushActionBotifiedPlayer,
    'put-card': doPushActionPutCard,
    'drawn-card': doPushActionDrawnCard,
    'kept-card': doPushActionKeptCard,
    'selected-color': doPushActionSelectedColor,
    'said-uno': doPushActionSaidUno,
    'next-turn': doPushActionNextTurn,
    'finished-game': doPushActionFinishedGame,
    'end': doPushActionEnd,
    'switch-in': doPushActionSwitchIn,
    'switch-finished': doPushActionSwitchFinished,
    'request-stop-party': doPushActionRequestStopParty,
    'revoke-request-stop-party': doPushActionRevokeRequestStopParty,
    'stop-party': doPushActionStopParty,
    'request-botify-player': doPushActionRequestBotifyPlayer,
    'cancel-botify-player': doPushActionCancelBotifyPlayer,
    'chat-message': doPushActionChatMessage
};
