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

function generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
