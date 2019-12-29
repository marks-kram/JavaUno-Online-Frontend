const apiBase = '/api';
const appId = '#javaUno';
const noSuchGameMessage = 'failure: de.markherrmann.javauno.exceptions.IllegalArgumentException: There is no such game.';
Vue.config.devtools = true;

const hostname = location.hostname;

const gameState = {
    success: true,
    message: 'success',
    game: null,
    players: [],
    cards: [],
    myIndex: -1
};

const data = {
    qrCodeBase: 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=https%3A%2F%2F' + hostname + '%2Finvention.html%23',
    showQr: false,
    gameUuid: '',
    playerUuid: '',
    invention: false,
    currentView: '',
    name: '',
    botName: '',
    gameState: gameState,
    message: ''
};

const methods = {
    callback: null,
    createGame: function(){createGame()},
    joinGame: function () {joinGame()},
    leaveGame: function () {leaveGame()},
    addBot: function () {addBot()},
    removeBot: function (player) {removeBot(player)},
    loadGame: function (){loadGame()},
    startGame: function (){startGame()},
    getPlayerName: function(player){getPlayerName(player)},
    getPlayerType: function(player){getPlayerType(player)},
    copyLink: function(){copyLink()}
};

const app = new Vue({
    el: appId,
    data: data,
    methods: methods
});
