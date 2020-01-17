function getCardImage(card, size) {
    let image = '/res/img/cards/' + size + '/';

    if(card.cardType === 'NUMBER'){
        image += card.color.toLowerCase() + card.value;
    }
    if(card.cardType === 'SKIP'){
        image += card.color.toLowerCase() + 'skip';
    }
    if(card.cardType === 'REVERSE'){
        image += card.color.toLowerCase() + 'reverse';
    }
    if(card.cardType === 'DRAW_2'){
        image += card.color.toLowerCase() + 'draw2';
    }
    if(card.cardType === 'JOKER'){
        image += 'joker';
    }
    if(card.cardType === 'DRAW_4'){
        image += 'jokerdraw4';
    }

    image += '.png';

    return image;
}

function put(card, index){
    if(isPutAllowed(card, index)){
        const data = {
            card: card,
            cardIndex: index,
            gameUuid: app.gameUuid,
            playerUuid: app.playerUuid
        };
        doPostRequest('/turn/put', data, loadGame);
    }
}

function draw(){
    if(isDrawAllowed()){
        doAction('draw');
    }
}

function keep(){
    doAction('keep');
}

function selectColor(color){
    const path = '/turn/select-color/' + app.gameUuid + '/' + app.playerUuid + '/' + color;
    doPostRequest(path, {}, loadGame);
}

function sayUno(){
    doAction('say-uno');
}

function next() {
    const path = '/turn/next/' + app.gameUuid + '/' + app.playerUuid;
    doPostRequest(path, {}, nullCallback);
}

function isPutAllowed(card, index){
    if(!isMyTurn()){
        return false;
    }
    if(!isPlayable(card)){
        return false;
    }
    if(app.gameState.game.turnState === 'PUT_DRAWN'){
        return index === (app.gameState.ownCards.length-1);
    }
    return app.gameState.game.turnState === 'PUT_OR_DRAW' || app.gameState.game.turnState === 'DRAW_DUTIES_OR_CUMULATIVE';
}

function isDrawAllowed() {
    if(!isMyTurn()){
        return false;
    }
    if(app.gameState.game.turnState === 'PUT_DRAWN'){
        return false;
    }
    if(app.gameState.game.turnState === 'SELECT_COLOR'){
        return false;
    }
    return app.gameState.game.turnState !== 'FINAL_COUNTDOWN';
}

function isSayUnoAllowed() {
    if(!isMyTurn()){
        return false;
    }
    return app.gameState.game.turnState === 'SELECT_COLOR' || app.gameState.game.turnState === 'FINAL_COUNTDOWN';
}

function isMyTurn(){
    return isPlayersTurn(app.gameState.myIndex);
}

function isNotMe(index){
    return index !== app.gameState.myIndex && app.gameState.myIndex >= 0;
}

function isPlayersTurn(index){
    return app.gameState.game.currentPlayerIndex === index && app.gameState.myIndex >= 0;
}

function doAction(action){
    const path = '/turn/' + action + '/' + app.gameUuid + '/' + app.playerUuid;
    doPostRequest(path, {}, loadGame);
}

function isPlayable(card){
    if(app.gameState.game.turnState === 'DRAW_DUTIES_OR_CUMULATIVE' && !isCumulative(app.gameState.game.topCard, card)){
        return false;
    }
    return isMatch(app.gameState.game.topCard, card);
}

function isCumulative(topCard, card){
    return topCard.drawValue === card.drawValue;
}

function isMatch(topCard, card){
    if(card.jokerCard){
        return true;
    }
    switch(topCard.cardType){
        case 'NUMBER':
            return card.value === topCard.value || card.color === topCard.color;
        case 'SKIP':
        case 'REVERSE':
        case 'DRAW_2':
            return card.cardType === topCard.cardType || card.color === topCard.color;
        case 'JOKER':
        case 'DRAW_4':
            return card.color === app.gameState.game.desiredColor;
    }
    return false;
}

function nullCallback(data){
    data = null;
}
