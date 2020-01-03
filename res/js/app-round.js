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
