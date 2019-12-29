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
    handleInvention();
    init();
    document.getElementById('javaUno').style.display = 'block';
});