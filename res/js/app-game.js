function setGame(data){
    app.gameUuid = data.gameUuid;
    app.$cookies.set('gameUuid', app.gameUuid);
    loadGameWithoutPlayer();
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

function setGameStateWithoutPlayer(data){
    app.gameState = data;
    app.currentView = 'join';
}

function loadGame(){
    const path = '/gameState/get/' + app.gameUuid + '/' + app.playerUuid;
    doGetRequest(path, setGameState);
}

function loadGameWithoutPlayer(){
    const path = '/gameState/get/' + app.gameUuid;
    doGetRequest(path, setGameStateWithoutPlayer);
}

function createGame() {
    doPostRequest('/game/create', {}, setGame);
}

function startGame(){
    doPostRequest('/game/start/' + app.gameUuid, {}, loadGame);
}

function reset(){
    app.$cookies.remove('gameUuid');
    app.$cookies.remove('playerUuid');
    app.$cookies.remove('invention');
    location.reload();
}

function handleInvention(){
    if(location.hash !== '' && location.hash !== '#'){
        const gameUuid = location.hash.replace(/^#/, '');
        app.$cookies.set('gameUuid', gameUuid);
        app.$cookies.remove('playerUuid');
        app.$cookies.set('invention', '1');
        location.replace('/');
    }
}

function init(){
    const invention = app.$cookies.get('invention');
    if(invention != null && invention === '1'){
        app.invention = true;
    }
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
        app.loadGameWithoutPlayer();
    }
}

window.addEventListener("load", function() {
    handleInvention();
    init();
    document.getElementById(appId).style.display = 'block';
});
