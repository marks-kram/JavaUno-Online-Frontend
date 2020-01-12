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
    if(isPutAllowed(card)){
        const data = {
            card: card,
            cardIndex: index,
            gameUuid: app.gameUuid,
            playerUuid: app.playerUuid
        };
        doPostRequest('/action/put', data, loadGame);
    }
}

function putDrawn(){
    const cardIndex = app.gameState.ownCards.length-1;
    const card = app.gameState.ownCards[cardIndex];
    put(card, cardIndex);
}

function draw(){
    if(isDrawAllowed()){
        doAction('draw');
    }
}

function keep(){
    doAction('keep');
}

function getColoredCardCount(color){
    let count = 0;
    for(let i = 0; i < app.gameState.ownCards.length; i++){
        const card = app.gameState.ownCards[i];
        console.log(color + '==' + card.color + '?')
        if(card.color === color){
            console.log('yes');
            count++;
        }
    }
    return count;
}

function selectColor(color){
    const path = '/action/select-color/' + app.gameUuid + '/' + app.playerUuid + '/' + color;
    doPostRequest(path, {}, loadGame);
}

function sayUno(){
    app.toast = 'Du: „Uno“';
    doAction('say-uno');
}

function isPutAllowed(card){
    if(!isMyTurn()){
        return false;
    }
    if(!isPlayable(card)){
        return false;
    }
    return app.gameState.game.turnState === 'PUT_OR_DRAW' ||
        app.gameState.game.turnState === 'PUT_DRAWN' || app.gameState.game.turnState === 'DRAW_DUTIES_OR_CUMULATIVE';
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
    return isMyTurn() && app.gameState.game.turnState === 'FINAL_COUNTDOWN';
}

function isMyTurn(){
    return isPlayersTurn(app.gameState.myIndex);
}

function isPlayersTurn(index){
    return app.gameState.game.currentPlayerIndex === index && app.gameState.myIndex >= 0;
}

function doAction(action){
    const path = '/action/' + action + '/' + app.gameUuid + '/' + app.playerUuid;
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
