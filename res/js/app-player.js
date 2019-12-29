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