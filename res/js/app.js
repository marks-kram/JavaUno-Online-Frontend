Vue.config.devtools = config.vueDevToolsEnabled;
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
    message: '',
    toast: '',
    timeLeftPercent: 100
};

const methods = {
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
    getCardImage: function(card, size) { return getCardImage(card, size) },
    getColoredCardCount: function(color) { return getColoredCardCount(color) },
    put: function(card, index) { put(card, index) },
    draw: function() { draw() },
    keep: function() { keep() },
    selectColor: function(color) { selectColor(color) },
    sayUno: function() { sayUno() },
    isPutAllowed: function(card, index) { return isPutAllowed(card, index) },
    isDrawAllowed: function() { return isDrawAllowed() },
    isSayUnoAllowed: function() { return isSayUnoAllowed() },
    isMyTurn: function() { return isMyTurn() },
    isPlayersTurn: function(index) { return isPlayersTurn(index) }
};

const app = new Vue({
    el: '#javaUno',
    data: data,
    methods: methods
});
