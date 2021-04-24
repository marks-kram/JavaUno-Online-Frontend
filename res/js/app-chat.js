function showChat(){
    app.previousView = app.currentView;
    app.currentView = 'chat';
    setReadMessages();
    setTimeout('enableChatScrolling()', 200);
}

function hideChat(){
    app.currentView = app.previousView;
    app.previousView = '';
    updateView();
}

function setSendMessage(){
    stopProcessingAnimation();
    app.message = '';
}

function sendMessage(){
    const path = `/game/chat/send-message`;
    const data = {
        content: app.message,
        gameUuid: app.gameUuid,
        playerUuid: app.playerUuid
    }
    doPostRequest(path, data, setSendMessage);
    document.querySelector('#chat-view input').focus();
}

function setReadMessages(){
    app.readMessages = app.gameState.game.messages.length;
    localStorage.setItem("readMessages", app.readMessages);
}

function getReadMessages(){
    let readMessages = localStorage.getItem('readMessages');
    if(readMessages === null){
        readMessages = '0';
    }
    app.readMessages = parseInt(readMessages);
    localStorage.setItem("readMessages", app.readMessages);
}

function enableChatScrolling(){
    setTimeout('scrollToChatEnd()', 200);
    document.querySelector('#chat-view input').addEventListener('click', scrollToChatEnd);
}

function scrollToChatEnd(){
    const element = document.querySelector("html");
    element.scrollTo(0,element.scrollHeight);
}

function getMessageDirection(playerPublicUuid){
    const myPublicUuid = app.gameState.players[app.gameState.myIndex].publicUuid;
    return (playerPublicUuid === myPublicUuid) ? 'out' : 'in';
}

function getPlayerNameByPublicUuid(publicUuid) {
    const players = app.gameState.players;
    for(let i = 0; i < players.length; i++){
        const player = players[i];
        if(player.publicUuid === publicUuid){
            const name = player.name;
            return getPlayerName(name, i);
        }
    }
    return "[Entfernter Spieler]";
}


