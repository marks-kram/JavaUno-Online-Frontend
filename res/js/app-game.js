function setGame(data){
    app.gameUuid = data.gameUuid;
    app.$cookies.set('gameUuid', app.gameUuid);
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
    app.currentView = data.game.gameLifecycle.toLowerCase();
    joinGameRunning = false;
    setGameStateRunning = false;
    if(app.gameState.game.turnState === 'FINAL_COUNTDOWN' && app.gameState.game.gameLifecycle === 'RUNNING' && aC === null){
        aC = 0;
        if(app.$cookies.get('sayUno') !== null && app.$cookies.get('sayUno') === '1'){
            sayUno();
        }
        startCountdownAnimation();
    }
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
    if(config.enableTokenizedGameCreate && app.token === ''){
        return;
    }
    app.btnCreateGameDisabled = true;
    doPostRequest('/game/create/'+app.token, {}, setGame);
}

function startGame(){
    app.timeLeftPercent = 100;
    app.$cookies.set('gameUuid', app.gameUuid);
    app.$cookies.set('playerUuid', app.playerUuid);
    doPostRequest('/game/start/' + app.gameUuid, {}, loadGame);
}

function reset(){
    app.$cookies.remove('gameUuid');
    app.$cookies.remove('playerUuid');
    app.$cookies.remove('invitation');
    self.location.replace('/');
}

function handleInvitation(){
    if(location.hash.startsWith("#game:")){
        const gameUuid = location.hash.replace(/^#game:/, '');
        app.$cookies.set('gameUuid', gameUuid);
        app.$cookies.set('invitation', '1');
        location.replace('/');
    }
}

function handleToken(){
    if(!features.enableTokenizedGameCreate){
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    app.token = (token === null || token === '') ? 'empty' : token.replace('/', '');
}

function isTokenPatternValid(){
    const tokenRegex = "^([a-zA-Z0-9_-]{11})\\.([a-zA-Z0-9_-]{11})$";
    return new RegExp(tokenRegex).test(app.token);
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
    let gameUuid = app.$cookies.get('gameUuid');
    let playerUuid = app.$cookies.get('playerUuid');
    if((gameUuid != null && gameUuid !== '') || (playerUuid != null && playerUuid !== '')){
        showErrorDialog('Hier ist bereits ein Spiel. Wechsel kann nicht erfolgen.');
        self.location.replace('/');
        return false;
    }
    gameUuid = urlParams.get('gameUuid');
    playerUuid = urlParams.get('playerUuid');
    if(gameUuid != null && gameUuid !== '' && playerUuid != null && playerUuid !== ''){
        app.$cookies.set('gameUuid', gameUuid);
        app.$cookies.set('playerUuid', playerUuid);
        doPostRequest(`/switch/switch-finished/${gameUuid}/${playerUuid}`, {}, setSwitchFinished);
        return true;
    }
}

function setSwitchIn(pushUuid){
    doPostRequest(`/switch/switch-in/${pushUuid}/${app.gameUuid}/${app.playerUuid}`, {}, nullCallback);
}

function switchIn(urlParams){
    const pushUuid = urlParams.get('pushUuid');
    const gameUuid = app.$cookies.get('gameUuid');
    const playerUuid = app.$cookies.get('playerUuid');
    app.pendingRemoveAfterSwitch = true;
    app.gameUuid = gameUuid;
    app.playerUuid = playerUuid;
    if(pushUuid !== null && pushUuid !== '' && gameUuid !== null && gameUuid !== '' && playerUuid !== null && playerUuid !== ''){
        connectPush(gameUuid, setSwitchIn, pushUuid);
        return true;
    } else {
        showErrorDialog('Hier ist kein Spiel. Wechsel kann nicht erfolgen.');
        self.location.replace('/');
        return false;
    }
}

function init(){
    const invitation = app.$cookies.get('invitation');
    if(invitation != null && invitation === '1'){
        app.invitation = true;
    }
    const gameUuid = app.$cookies.get('gameUuid');
    if(gameUuid == null){
        app.currentView = 'start';
        app.tokenValidPattern = isTokenPatternValid();
        app.tokenLockedGameCreate = features.enableTokenizedGameCreate && !isTokenPatternValid();
        return;
    }
    app.gameUuid = gameUuid;
    connectPush(gameUuid, null, null);
    const playerUuid = app.$cookies.get('playerUuid');
    if(playerUuid != null){
        app.playerUuid = playerUuid;
        app.loadGame();
    } else {
        app.loadGameWithoutPlayer();
    }
}

window.addEventListener("load", function() {
    const isSwitch = handleSwitchDevice();
    if(isSwitch){
        return;
    }
    handleInvitation();
    handleToken();
    init();
    document.getElementById('javaUno').style.display = 'block';
});
