let joinGameRunning = false;

function joinGame(){
    app.btnJoinGameDisabled = true;
    joinGameRunning = true;
    const data = {
        bot: false,
        gameUuid: app.gameUuid,
        name: app.name
    };
    doPostRequest('/player/add', data, setPlayer);
}

function setPlayer(data){
    app.playerUuid = data.playerUuid;
    localStorage.setItem('playerUuid', app.playerUuid);
    localStorage.removeItem('invitation');
    app.loadGame();
}

function addBot(){
    const data = {
        bot: true,
        gameUuid: app.gameUuid,
        name: app.botName
    };
    app.botName = '';
    localStorage.setItem('gameUuid', app.gameUuid);
    localStorage.setItem('playerUuid', app.playerUuid);
    doPostRequest('/player/add', data, loadGame);
}

function removeBot(player){
    let path = '/player/removeBot/' + app.gameUuid + '/' + player.publicUuid;
    localStorage.setItem('gameUuid', app.gameUuid);
    localStorage.setItem('playerUuid', app.playerUuid);
    doDeleteRequest(path, loadGame);
}

function removeBotInGame(player){
    let path = '/player/removeBotInGame/' + app.gameUuid + '/' + player.publicUuid;
    localStorage.setItem('gameUuid', app.gameUuid);
    localStorage.setItem('playerUuid', app.playerUuid);
    doDeleteRequest(path, loadGame);
}

function leaveGame(){
    let path = '/player/remove/' + app.gameUuid + '/' + app.playerUuid;
    doDeleteRequest(path, reset);
}

function getPlayerName(name, index) {
    const indexedPlayerName = 'Spieler ' + (index+1) + '';
    if(name.trim() === '' || new RegExp('^Spieler\\s+\\d+').test(name.trim())){
        return indexedPlayerName;
    }
    return name.trim().replace(/(<.*?>|&.*?;)/g, '');
}

function getPlayerNameByPlayerInfo(playerInfo) {
    const name = playerInfo.name;
    const uuid = playerInfo.publicUuid;
    if(name !== null && name.trim() !== ''){
        return name;
    }
    for(let player in app.gameState.players){
        if(player.publicUuid === uuid){
            const index = app.gameState.players.indexOf(player);
            return `Spieler ${index}`;
        }
    }
}

function copyLink(){
    const copyText = document.getElementById('invitation-link-toCopy');
    copyText.select();
    copyText.setSelectionRange(0, 99); /*For mobile devices*/
    document.execCommand("copy");
    showToast('Erfolgreich kopiert!');
}

function showInvitationQrCode(){
    app.qr = genQr(app.protocol+'://' + app.hostname + '/invitation.html#game:' + app.gameUuid);
    app.showInvitationQr = true;
}

function confirmLeaveRunningGame(){
    showConfirmationDialog('Bist du sicher, dass du während des laufenden Spiels den Spielspaß beenden möchtest? ' +
        'Du wirst dadurch in einen Bot umgewandelt.', leaveRunningGame, null)
}

function leaveRunningGame(){
    app.dialog = null;
    let path = '/player/botify/' + app.gameUuid + '/' + app.playerUuid;
    doPostRequest(path, {}, reset);
}

function confirmRequestBotifyPlayer(player){
    app.playerToBotify = player;
    showConfirmationDialog('Bist du sicher, dass du diesen Spieler entfernen möchtest?', requestBotifyPlayer, null);
}

function requestBotifyPlayer(){
    app.dialog = null;
    let path = '/player/request-botify/' + app.gameUuid + '/' + app.playerToBotify.publicUuid;
    doPostRequest(path, {}, setRequestBotifyPlayer);
}

function setRequestBotifyPlayer(){
    showInformationDialog('Der Spieler wird zum Bot, wenn er dies nicht innerhalb 10 Sekunden abbricht. Danach kannst du den Spieler (Bot) entfernen.');
    app.botifyPlayerPending = true;
}

function cancelBotify(){
    clearInterval(rTCDSL);
    app.dialog = null;
    let path = '/player/cancel-botify/' + app.gameUuid + '/' + app.playerUuid;
    doPostRequest(path, {}, setCancelBotifyPlayer);
}

function setCancelBotifyPlayer(){
    showInformationDialog(`Der Prozess wurde efolgreich abgebrochen.${isMyTurn()? ' Bitte mache nun deinen Spielzug.' : ''}`);
}

function getPlayerClasses(player){
    let classes = 'player';
    if(player.stopPartyRequested){
        classes = `${classes} stopPartyRequested`;
    }
    if(player.botifyPending){
        classes = `${classes} botifyPending`;
    }
    if(player.bot){
        classes = `${classes} bot`;
    }
    return classes;
}