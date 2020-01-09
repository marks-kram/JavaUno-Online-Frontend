let joinGameRunning = false;

function joinGame(){
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
    app.$cookies.remove('invention');
    app.loadGame();
}

function addBot(){
    const data = {
        bot: true,
        gameUuid: app.gameUuid,
        name: app.botName
    };
    app.botName = '';
    doPostRequest('/player/add', data, loadGame);
}

function removeBot(player){
    let path = '/player/removeBot/' + app.gameUuid + '/' + player.botUuid;
    doDeleteRequest(path, loadGame);
}

function leaveGame(){
    let path = '/player/remove/' + app.gameUuid + '/' + app.playerUuid;
    doDeleteRequest(path, reset);
}

function getPlayerName(player) {
    if(player.name !== ''){
        return player.name;
    }
    return 'Spieler ' + (app.players.indexOf(player)+1);
}

function getPlayerType(player) {
    return player.bot ? 'Computer' : 'Mensch';
}

function copyLink(){
    const copyText = document.getElementById('invention-link-toCopy');
    copyText.select();
    copyText.setSelectionRange(0, 99); /*For mobile devices*/
    document.execCommand("copy");
    showToast('Erfolgreich kopiert!');
}

function showQrCode(){
    const typeNumber = 0;
    const errorCorrectionLevel = 'L';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData('https://' + hostname + '/invention.html#' + app.gameUuid);
    qr.make();
    document.getElementById('invention-qr-code').innerHTML = qr.createImgTag(8, 32, '');
    app.showQr = true;
}
