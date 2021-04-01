function setGame(data){
    app.gameUuid = data.gameUuid;
    app.$cookies.set('gameUuid', app.gameUuid);
    self.location.replace('/');
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
    joinGameRunning = false;
    setGameStateRunning = false;
    if(app.gameState.game.turnState === 'FINAL_COUNTDOWN' && app.gameState.game.gameLifecycle === 'RUNNING' && aC === null){
        aC = 0;
        if(app.$cookies.get('sayUno') !== null && app.$cookies.get('sayUno') === '1'){
            sayUno();
        }
        startCountdownAnimation();
    }
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
    if(config.enableTokenizedGameCreate && app.token === ''){
        return;
    }
    app.btnCreateGameDisabled = true;
    doPostRequest('/game/create/'+app.token, {}, setGame);
}

function startGame(){
    app.timeLeftPercent = 100;
    app.$cookies.set('gameUuid', app.gameUuid);
    app.$cookies.set('playerUuid', app.playerUuid);
    doPostRequest('/game/start/' + app.gameUuid, {}, loadGame);
}

function reset(){
    app.$cookies.remove('gameUuid');
    app.$cookies.remove('playerUuid');
    app.$cookies.remove('invitation');
    self.location.reload();
}

function handleInvitation(){
    if(location.hash.startsWith("#game:")){
        const gameUuid = location.hash.replace(/^#game:/, '');
        app.$cookies.set('gameUuid', gameUuid);
        app.$cookies.set('invitation', '1');
        location.replace('/');
    }
}

function handleToken(){
    if(!features.enableTokenizedGameCreate){
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    app.token = (token === null || token === '') ? 'empty' : token.replace('/', '');
}

function isTokenPatternValid(token){
    const tokenRegex = "^([a-zA-Z0-9_-]{11})\\.([a-zA-Z0-9_-]{11})$";
    return new RegExp(tokenRegex).test(token);
}

function init(){
    const invitation = app.$cookies.get('invitation');
    if(invitation != null && invitation === '1'){
        app.invitation = true;
    }
    const gameUuid = app.$cookies.get('gameUuid');
    if(gameUuid == null){
        app.currentView = (features.enableTokenizedGameCreate && !isTokenPatternValid(app.token)) ? 'noToken' : 'start';
        return;
    }
    app.gameUuid = gameUuid;
    connectPush(gameUuid);
    const playerUuid = app.$cookies.get('playerUuid');
    if(playerUuid != null){
        app.playerUuid = playerUuid;
        app.loadGame();
    } else {
        app.loadGameWithoutPlayer();
    }
}

window.addEventListener("load", function() {
    handleInvitation();
    handleToken();
    init();
    document.getElementById('javaUno').style.display = 'block';
});
