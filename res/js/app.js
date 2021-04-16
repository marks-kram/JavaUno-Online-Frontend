Vue.config.devtools = config.vueDevToolsEnabled;

const gameState = {
    success: true,
    message: 'success',
    game: null,
    players: [],
    cards: [],
    myIndex: -1
};

const data = {
    winner: -1,
    showInvitationQr: false,
    showSwitchOutQr: false,
    showSwitchInQr: false,
    qr: '',
    gameUuid: '',
    playerUuid: '',
    invitation: false,
    currentView: '',
    previousView: '',
    name: '',
    botName: '',
    gameState: gameState,
    timeLeftPercent: 100,
    btnCreateGameDisabled: false,
    btnJoinGameDisabled: false,
    processing: false,
    processingEnd: false,
    enableTokenizedGameCreate: false,
    token: 'empty',
    tokenLockedGameCreate: false,
    hostname: config.siteHostname,
    protocol: config.siteProtocol,
    hasCamera: false,
    pendingRemoveAfterSwitch: false,
    pendingSwitch: false,
    pendingPlayerIndex: -1,
    pushUuid: '',
    dialog: null,
    stopPartyRequested: false,
    botifyPlayerPending: false,
    playerToBotify: null,
};

const methods = {
    createGame: function(){createGame()},
    joinGame: function () {joinGame()},
    leaveGame: function () {leaveGame()},
    addBot: function () {addBot()},
    removeBot: function (player) {removeBot(player)},
    removeBotInGame: function (player){removeBotInGame(player)},
    reset: function (){reset()},
    loadGame: function (){loadGame()},
    loadGameWithoutPlayer: function (){loadGameWithoutPlayer()},
    startGame: function (){startGame()},
    getPlayerName: function(name, index){ return getPlayerName(name, index)},
    copyLink: function(){copyLink()},
    showInvitationQrCode: function () {showInvitationQrCode()},
    getCardImage: function(card, size) { return getCardImage(card, size) },
    put: function(card, index) { put(card, index) },
    draw: function() { draw() },
    keep: function() { keep() },
    selectColor: function(color) { selectColor(color) },
    sayUno: function() { sayUno() },
    isPutAllowed: function(card, index) { return isPutAllowed(card, index) },
    isDrawAllowed: function() { return isDrawAllowed() },
    isSayUnoAllowed: function() { return isSayUnoAllowed() },
    isMyTurn: function() { return isMyTurn() },
    isPlayersTurn: function(index) { return isPlayersTurn(index) },
    scanQr: function() { scanQr() },
    prepareSwitchDevice: function (){ prepareSwitchDevice() },
    abortSwitchDevice: function (){ abortSwitchDevice() },
    prepareSwitchOut: function (){ prepareSwitchOut() },
    abortSwitchOut: function (){ abortSwitchOut() },
    prepareSwitchIn: function (){ prepareSwitchIn() },
    abortSwitchIn: function (){ abortSwitchIn() },
    confirmLeaveRunningGame: function(){confirmLeaveRunningGame();},
    confirmRequestStopParty: function(){confirmRequestStopParty()},
    revokeRequestStopParty: function(){revokeRequestStopParty()},
    getPlayerClasses: function (player){ return getPlayerClasses(player)},
    confirmRequestBotifyPlayer: function(player){confirmRequestBotifyPlayer(player)}
};

const app = new Vue({
    el: '#javaUno',
    data: data,
    methods: methods
});

function hasTouch() {
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
}

if(!hasTouch()){
    document.body.setAttribute('class', 'hover');
}

function showErrorDialog(text){
    app.dialog = {
        classes: 'error',
        confirm: false,
        timedCancel: false,
        secondsLeft: 0,
        confirmCallback: null,
        cancelCallback: null,
        text: text
    }
}

function showInformationDialog(text){
    app.dialog = {
        classes: '',
        confirm: false,
        timedCancel: false,
        secondsLeft: 0,
        confirmCallback: null,
        cancelCallback: null,
        text: text
    }
}

function showConfirmationDialog(text, confirmCallback){
    app.dialog = {
        classes: '',
        confirm: true,
        timedCancel: false,
        secondsLeft: 0,
        confirmCallback: confirmCallback,
        cancelCallback: null,
        text: text
    }
}
let rTCDSL;

function showTimedCancelDialog(text, cancelCallback, time){
    app.dialog = {
        classes: '',
        confirm: false,
        timedCancel: true,
        secondsLeft: time,
        confirmCallback: null,
        cancelCallback: cancelCallback,
        text: text
    }
    rTCDSL = setInterval('reduceTimedConfirmationDialogSecondsLeft()', 1000);
}



function reduceTimedConfirmationDialogSecondsLeft(){
    if(--app.dialog.secondsLeft <= 0){
        clearInterval(rTCDSL);
    }
}
