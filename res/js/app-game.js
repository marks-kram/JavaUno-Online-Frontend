function setGame(data){
    app.gameUuid = data.gameUuid;
    app.$cookies.set('gameUuid', app.gameUuid);
    connectPush(app.gameUuid);
    loadGameWithoutPlayer();
}

let setGameStateRunning = false;

async function waitForGameStateToBeSet(){
    let waitFor = 0;
    while(setGameStateRunning){
       waitFor++;
       await sleep();
    }
    console.log('Wait for setGameState to be finished for ' + waitFor + ' times.');
    setGameStateRunning = true;
}

function setGameState(data){
    waitForGameStateToBeSet();
    app.gameState = data;
    app.currentView = data.game.gameLifecycle.toLowerCase();
    if(app.toast !== ''){
        showToast(app.toast);
        app.toast = '';
    }
    joinGameRunning = false;
    setGameStateRunning = false;
}

function setGameStateWithoutPlayer(data){
    waitForGameStateToBeSet();
    app.gameState = data;
    app.currentView = 'join';
    setGameStateRunning = false;
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
    self.location.reload();
}

function handleInvention(){
    if(location.hash !== '' && location.hash !== '#'){
        const gameUuid = location.hash.replace(/^#/, '');
        app.$cookies.set('gameUuid', gameUuid);
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
    connectPush(gameUuid);
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
    document.getElementById('javaUno').style.display = 'block';
});
