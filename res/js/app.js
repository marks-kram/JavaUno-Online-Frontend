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
    addBot: function () {addBot()},
    loadGame: function (){loadGame()},
    getPlayerName: function(player){getPlayerName(player)},
    getPlayerType: function(player){getPlayerType(player)}
};

const app = new Vue({
    el: appId,
    data: data,
    methods: methods
});

function handleRequestSuccess(response) {
    if(response.data.success){
        app.callback(response.data);
    } else {
        if(response.data.message === noSuchGameMessage){
            app.currentView = reset();
        }
        console.error("Error. Response: " + response.data.message);
    }
}

function handleRequestError(response) {
    if(response.data.message !== undefined){
        console.error("Request-Error: " + response.data.message);
    } else {
        console.error("Request-Error: " + response);
    }
}

function doGetRequest(path, callback){
    app.callback = callback;
    app.$http.get(apiBase+path).then(handleRequestSuccess, handleRequestError);
}

function doPostRequest(path, data, callback){
    app.callback = callback;
    app.$http.post(apiBase+path, JSON.stringify(data)).then(handleRequestSuccess, handleRequestError);
}

function setGame(data){
    app.gameUuid = data.gameUuid;
    app.currentView = 'join';
    app.$cookies.set('gameUuid', app.gameUuid);
}

function setPlayer(data){
    app.playerUuid = data.playerUuid;
    app.$cookies.set('playerUuid', app.playerUuid);
    app.loadGame();
}

function setGameState(data){
    app.gameState = data;
    app.currentView = data.game.gameLifecycle.toLowerCase();
}

function loadGame(){
    const path = '/gameState/get/' + app.gameUuid + '/' + app.playerUuid;
    doGetRequest(path, setGameState);
}

function createGame() {
    doPostRequest('/game/create', {}, setGame);
}

function joinGame(){
    const data = {
        bot: false,
        gameUuid: app.gameUuid,
        name: app.name
    };
    doPostRequest('/player/add', data, setPlayer);
}

function addBot(){
    const data = {
        bot: true,
        gameUuid: app.gameUuid,
        name: app.botName
    };
    doPostRequest('/player/add', data, loadGame);
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

function init(){
    const gameUuid = app.$cookies.get('gameUuid');
    if(gameUuid == null || gameUuid === undefined){
        app.currentView = 'start';
        return;
    }
    app.gameUuid = gameUuid;
    const playerUuid = app.$cookies.get('playerUuid');
    if(playerUuid != null && playerUuid !== undefined){
        app.playerUuid = playerUuid;
        app.loadGame();
    } else {
        app.currentView = 'join';
    }
}

function reset(){
    app.$cookies.remove('gameUuid');
    app.$cookies.remove('playerUuid');
    location.reload();
}

function handleInvention(){
    if(location.hash !== '' && location.hash !== '#'){
        const gameUuid = location.hash.replace(/^#/, '');
        app.$cookies.set('gameUuid', gameUuid);
        location.replace('/');
    }
}

window.addEventListener("load", function() {
    handleInvention();
    init();
    document.getElementById('javaUno').style.display = 'block';
});