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
    document.querySelector('#chatControl input').focus();
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
    scrollToChatEnd();
    document.querySelector("#messages").addEventListener('scroll', updateChatScrolledProperties);
}

function scrollToChatTop(){
    if(hasTouch()){
        document.querySelector('#chat-before').scrollIntoView();
        updateChatScrolledProperties();
        return;
    }
    document.querySelector("#messages").scrollTo(0, 0);
    updateChatScrolledProperties();
}

function scrollToChatEnd(){
    if(hasTouch()){
        document.querySelector('#chat-after').scrollIntoView();
        updateChatScrolledProperties();
        return;
    }
    const element = document.querySelector("#messages");
    element.scrollTo(0,element.scrollHeight);
    updateChatScrolledProperties();
}

function isChatScrolledToTop(){
    return document.querySelector('#messages').scrollTop === 0;
}

function isChatScrolledToEnd(){
    const containerHeight = document.querySelector('#messages').clientHeight;
    const contentHeight = document.querySelector('#messages').scrollHeight;
    let maxOffset = contentHeight - containerHeight;
    return document.querySelector('#messages').scrollTop === maxOffset;
}

function updateChatScrolledProperties(){
    if(app.currentView === 'chat') {
        app.chatScrolledToTop = isChatScrolledToTop();
        app.chatScrolledToEnd = isChatScrolledToEnd();
    }
}
