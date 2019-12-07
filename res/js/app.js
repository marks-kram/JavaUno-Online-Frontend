const apiBase = '/api';
const appId = '#javaUno';

const gameState = {
    success: true,
    message: 'success',
    game: null,
    players: [],
    cards: []
};
const data = {
    apiBase: apiBase,
    gameUuid: '',
    playerUuid: '',
    invention: false,
    currentView: '',
    name: '',
    gameState: gameState,
    message: ''
};

const methods = {
    callback: null,
    createGame: function(){createGame()},
    joinGame: function () {joinGame();},
    loadGame: function (){loadGame()}
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
        console.error("Error. Response: " + response.data.message);
    }
}

function handleRequestError(response) {
    console.error("Request-Error: " + response);
}

function doGetRequest(path, callback){
    app.callback = callback;
    app.$http.get(app.apiBase+path).then(handleRequestSuccess, handleRequestError);
}

function doPostRequest(path, data, callback){
    app.callback = callback;
    app.$http.post(app.apiBase+path, JSON.stringify(data)).then(handleRequestSuccess, handleRequestError);
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

window.addEventListener("load", function() {
    init();
    document.getElementById('javaUno').style.display = 'block';
});