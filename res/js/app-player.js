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
    app.$cookies.set('playerUuid', app.playerUuid);
    app.$cookies.remove('invitation');
    app.loadGame();
}

function addBot(){
    const data = {
        bot: true,
        gameUuid: app.gameUuid,
        name: app.botName
    };
    app.botName = '';
    app.$cookies.set('gameUuid', app.gameUuid);
    app.$cookies.set('playerUuid', app.playerUuid);
    doPostRequest('/player/add', data, loadGame);
}

function removeBot(player){
    let path = '/player/removeBot/' + app.gameUuid + '/' + player.botUuid;
    app.$cookies.set('gameUuid', app.gameUuid);
    app.$cookies.set('playerUuid', app.playerUuid);
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

function copyLink(){
    const copyText = document.getElementById('invitation-link-toCopy');
    copyText.select();
    copyText.setSelectionRange(0, 99); /*For mobile devices*/
    document.execCommand("copy");
    showToast('Erfolgreich kopiert!');
}

function showInvitationQrCode(){
    app.qr = genQr(app.protocol+'://' + app.hostname + '/invitation.html#game:' + app.gameUuid);
    app.showQr = true;
}
