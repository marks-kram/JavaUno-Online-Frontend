const apiBase = '/api';
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
    winner: -1,
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
    reset: function (){reset()},
    loadGame: function (){loadGame()},
    loadGameWithoutPlayer: function (){loadGameWithoutPlayer()},
    startGame: function (){startGame()},
    getPlayerName: function(player){getPlayerName(player)},
    getPlayerType: function(player){getPlayerType(player)},
    copyLink: function(){copyLink()},
    showQrCode: function () {showQrCode()},
    getCardImage: function(card, size) { return getCardImage(card, size) }
};

const app = new Vue({
    el: '#javaUno',
    data: data,
    methods: methods
});
