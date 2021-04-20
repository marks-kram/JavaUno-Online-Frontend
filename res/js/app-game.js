const Scrollbar = window.Scrollbar;

function setGame(data){
    app.gameUuid = data.gameUuid;
    localStorage.setItem('gameUuid', app.gameUuid);
    self.location.replace('/');
}

let setGameStateRunning = false;

async function waitForGameStateToBeSet(){
    let waitFor = 0;
    while(setGameStateRunning){
       waitFor++;
       await sleep();
    }
    console.log('Wait for setGameState to be finished for ' + waitFor + ' times.');
    setGameStateRunning = true;
}

function setGameState(data){
    waitForGameStateToBeSet();
    app.gameState = data;
    app.stopPartyRequested = app.gameState.players[app.gameState.myIndex].stopPartyRequested;
    app.currentView = data.game.gameLifecycle.toLowerCase();
    joinGameRunning = false;
    setGameStateRunning = false;
    if(app.gameState.game.turnState === 'FINAL_COUNTDOWN' && app.gameState.game.gameLifecycle === 'RUNNING' && aC === null){
        aC = 0;
        if(localStorage.getItem('sayUno') !== null && localStorage.getItem('sayUno') === '1'){
            sayUno();
        }
        startCountdownAnimation();
    }
    app.gameLoadedWithPlayer = true;
}

function setGameStateWithoutPlayer(data){
    waitForGameStateToBeSet();
    app.gameState = data;
    app.currentView = 'join';
    setGameStateRunning = false;
}

function loadGame(){
    const path = '/gameState/get/' + app.gameUuid + '/' + app.playerUuid;
    doGetRequest(path, setGameState);
}

function loadGameWithoutPlayer(){
    const path = '/gameState/get/' + app.gameUuid;
    doGetRequest(path, setGameStateWithoutPlayer);
}

function createGame() {
    if(app.tokenLockedGameCreate){
        return;
    }
    app.btnCreateGameDisabled = true;
    doPostRequest('/game/create/'+app.token, {}, setGame);
}

function startGame(){
    app.timeLeftPercent = 100;
    localStorage.setItem('gameUuid', app.gameUuid);
    localStorage.setItem('playerUuid', app.playerUuid);
    doPostRequest('/game/start/' + app.gameUuid, {}, loadGame);
}

function reset(){
    localStorage.removeItem('gameUuid');
    localStorage.removeItem('playerUuid');
    localStorage.removeItem('invitation');
    localStorage.removeItem('sayUno');
    self.location.replace('/');
}

function handleInvitation(){
    if(location.hash.startsWith("#game:")){
        const gameUuid = location.hash.replace(/^#game:/, '');
        localStorage.setItem('gameUuid', gameUuid);
        localStorage.setItem('invitation', '1');
        location.replace('/');
    }
}

function handleTokenLink(){
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if(token === null){
        return false;
    }
    if(isTokenPatternValid(token)){
        localStorage.setItem('token', token);
    }
    self.location.replace('/');
    return true;
}

function setHandleTokenAndEnableView(data){
    setHandleToken(data)
    document.getElementById('javaUno').style.display = 'block';
}

function setHandleToken(data){
    stopProcessingAnimation();
    const enabled = data.message === 'on';
    if(!enabled){
        return;
    }
    app.enableTokenizedGameCreate = true;
    const token = localStorage.getItem('token');
    app.tokenValidPattern = isTokenPatternValid(token);
    if(!app.tokenValidPattern){
        localStorage.removeItem('token');
        app.tokenLockedGameCreate = true;
        return;
    }
    app.token = token;
}

function handleToken(){
    doGetRequest('/game/tokenized-game-create-enabled', setHandleTokenAndEnableView)
}

function isTokenPatternValid(token){
    if(token === null){
        return false;
    }
    const tokenRegex = "^([a-zA-Z0-9_-]{11})\\.([a-zA-Z0-9_-]{11})$";
    return new RegExp(tokenRegex).test(token);
}

function prepareSwitchDevice(){
    app.previousView = app.currentView;
    app.currentView = 'switch-device';
}

function abortSwitchDevice(){
    app.currentView = app.previousView;
    app.previousView = '';
}

function prepareSwitchOut(){
    app.qr = genQr(`${app.protocol}://${app.hostname}/?switch=out&gameUuid=${app.gameUuid}&playerUuid=${app.playerUuid}`);
    app.showSwitchOutQr = true;
    app.pendingRemoveAfterSwitch = true;
}

function abortSwitchOut(){
    app.qr = null;
    app.showSwitchOutQr = false;
    app.pendingRemoveAfterSwitch = false;
}

function setPreparedSwitchIn(pushUuid){
    app.qr = genQr(`${app.protocol}://${app.hostname}/?switch=in&pushUuid=${pushUuid}`);
    app.showSwitchInQr = true;
    app.pendingSwitch = true;
    app.pendingRemoveAfterSwitch = true;
}

function prepareSwitchIn(){
    const pushUuid = generateUUID();
    app.pushUuid = pushUuid;
    connectPush(pushUuid, setPreparedSwitchIn, pushUuid);
}

function abortSwitchIn(){
    app.qr = null;
    app.showSwitchInQr = false;
    disconnectPush();
    app.pendingSwitch = false;
    app.pendingRemoveAfterSwitch = false;
}

function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function handleSwitchDevice(){
    const urlParams = new URLSearchParams(window.location.search);
    const switchParam = urlParams.get('switch');
    if(switchParam != null && switchParam === 'out'){
        return switchOut(urlParams);
    }
    if(switchParam != null && switchParam === 'in'){
        return switchIn(urlParams);
    }
}

function setSwitchFinished(){
    self.location.replace('/');
}

function switchOut(urlParams){
    let gameUuid = localStorage.getItem('gameUuid');
    let playerUuid = localStorage.getItem('playerUuid');
    if((gameUuid != null && gameUuid !== '') || (playerUuid != null && playerUuid !== '')){
        app.refreshPageOnDialogClose = true;
        showErrorDialog('Hier ist bereits ein Spiel. Wechsel kann nicht erfolgen.');
        return false;
    }
    gameUuid = urlParams.get('gameUuid');
    playerUuid = urlParams.get('playerUuid');
    if(gameUuid != null && gameUuid !== '' && playerUuid != null && playerUuid !== ''){
        localStorage.setItem('gameUuid', gameUuid);
        localStorage.setItem('playerUuid', playerUuid);
        doPostRequest(`/switch/switch-finished/${gameUuid}/${playerUuid}`, {}, setSwitchFinished);
        return true;
    }
}

function setSwitchIn(pushUuid){
    doPostRequest(`/switch/switch-in/${pushUuid}/${app.gameUuid}/${app.playerUuid}`, {}, nullCallback);
}

function switchIn(urlParams){
    const pushUuid = urlParams.get('pushUuid');
    const gameUuid = localStorage.getItem('gameUuid');
    const playerUuid = localStorage.getItem('playerUuid');
    app.pendingRemoveAfterSwitch = true;
    app.gameUuid = gameUuid;
    app.playerUuid = playerUuid;
    if(pushUuid !== null && pushUuid !== '' && gameUuid !== null && gameUuid !== '' && playerUuid !== null && playerUuid !== ''){
        connectPush(gameUuid, setSwitchIn, pushUuid);
        return true;
    } else {
        app.refreshPageOnDialogClose = true;
        showErrorDialog('Hier ist kein Spiel. Wechsel kann nicht erfolgen.');
        return false;
    }
}

function removeSwitchedGameFromHere(data){
    const myIndex = data.myIndex;
    const pendingPlayerIndex = app.pendingPlayerIndex;
    if(myIndex === pendingPlayerIndex && app.pendingRemoveAfterSwitch){
        reset();
    }
}

function setRequestStopParty(){
    stopProcessingAnimation();
    if(app.currentView === 'running'){
        app.stopPartyRequested = true;
    }
}

function confirmRequestStopParty(){
    showConfirmationDialog('Bist du sicher, dass das laufende Spiel beendet werden soll? ' +
        'Die anderen müssen diesen Wunsch ebenfalls äußern.', requestStopParty, null);
}

function requestStopParty(){
    app.dialog = null;
    let path = '/player/request-stop-party/' + app.gameUuid + '/' + app.playerUuid;
    doPostRequest(path, {}, setRequestStopParty);
}

function setRevokeRequestStopParty(){
    stopProcessingAnimation();
    app.stopPartyRequested = false;
}

function revokeRequestStopParty(){
    let path = '/player/revoke-request-stop-party/' + app.gameUuid + '/' + app.playerUuid;
    doPostRequest(path, {}, setRevokeRequestStopParty);
}

function showChat(){
    app.previousView = app.currentView;
    app.currentView = 'chat';
    setReadMessages();
    setTimeout('scrollToChatEnd()', 200);
}

function hideChat(){
    app.currentView = app.previousView;
    app.previousView = '';
    updateView();
}

function setSendMessage(){
    stopProcessingAnimation();
    app.message = '';
}

function sendMessage(){
    const path = `/game/chat/send-message`;
    const data = {
        content: app.message,
        gameUuid: app.gameUuid,
        playerUuid: app.playerUuid
    }
    doPostRequest(path, data, setSendMessage);
}

function setReadMessages(){
    app.readMessages = app.gameState.game.messages.length;
    localStorage.setItem("readMessages", app.readMessages);
}

function getReadMessages(){
    let readMessages = localStorage.getItem('readMessages');
    if(readMessages === null){
        readMessages = '0';
    }
    app.readMessages = parseInt(readMessages);
    localStorage.setItem("readMessages", app.readMessages);
}

function scrollToChatEnd(){
    if(hasTouch()){
        document.querySelector('#messages div:last-child').scrollIntoView()
        return;
    }
    prepareScroll();
    doScroll();
    finishScroll();
}

function prepareScroll(){
    Scrollbar.destroyAll();
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('#main-views').style.overflow = 'hidden';
    document.querySelector('#main-views').style.overflowY = 'scroll';
}

function doScroll(){
    let element = document.querySelector('#main-views');
    element.scrollTop = element.scrollHeight;
}
function finishScroll(){
    document.querySelector('body').style.overflow = '';
    document.querySelector('#main-views').style.overflow = '';
    document.querySelector('#main-views').style.overflowY = '';
    enableScrolling();
}

function enableScrolling(){
    if(hasTouch()){
        document.querySelector('body').style.overflow = 'hidden';
        document.querySelector('body').style.overflowY = 'scroll';
        document.querySelector('header').style.position = 'fixed';
    }
    else {
        Scrollbar.init(document.querySelector('#main-views'), {});
    }
}

function init(){
    const invitation = localStorage.getItem('invitation');
    if(invitation != null && invitation === '1'){
        app.invitation = true;
    }
    const gameUuid = localStorage.getItem('gameUuid');
    if(gameUuid == null){
        app.currentView = 'start';
        handleToken();
        return false;
    }
    getReadMessages();
    app.gameUuid = gameUuid;
    connectPush(gameUuid, null, null);
    const playerUuid = localStorage.getItem('playerUuid');
    if(playerUuid != null){
        app.playerUuid = playerUuid;
        app.loadGame();
    } else {
        app.loadGameWithoutPlayer();
    }
    return true;
}

window.addEventListener("load", function() {
    enableScrolling();
    if(handleSwitchDevice()){
        return;
    }
    if(handleTokenLink()){
        return;
    }
    handleInvitation();
    if(init()){
        document.getElementById('javaUno').style.display = 'block';
    }
});

document.addEventListener('click', function(e) {
    if(document.activeElement.toString() !== '[object HTMLInputElement]'){
        document.activeElement.blur();
    }
});
