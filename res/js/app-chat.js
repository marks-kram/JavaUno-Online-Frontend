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
    updateChatScrollable();
    setTimeout('scrollToChatEnd()', 200);
    document.querySelector('#chat-view input').addEventListener('click', scrollToChatEnd);
    document.querySelector('#chat-view input').addEventListener('focus', updateChatScrollable);
    document.querySelector('#chat-view input').addEventListener('blur', updateChatScrollable);
}

function scrollToChatEnd(){
    if(!app.chatScrollable){
        return;
    }
    const element = document.querySelector("html");
    element.scrollTo(0,element.scrollHeight);
}

function updateChatScrollable(){
    const available = window.innerHeight - 30;
    const required = document.querySelector('#chat-view').clientHeight+30;
    const more = available - required;
    app.chatScrollable = more <= 0;
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


