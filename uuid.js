let get_characters = mode => {
    let stop, start, characters = '';
    switch(mode){
        case 'small letters':
            start = 97;
            stop = start + 26;
            break;
        case 'capital letters':
            start = 65;
            stop = start + 26;
            break;
        default:
            start = 48;
            stop = start + 10;
            break
    }
    while(start < stop){
        let char = String.fromCharCode(start);
        characters += char;
        start++;
    }
    return characters;
}





let uuid = len => {
    let smallLetters = get_characters('small letters');
    let capitalLetters = get_characters('capital letters');
    let numbers = get_characters('numbers');
    let id = '';
    let characters = [numbers, capitalLetters, smallLetters];
    for(let i=0; i < len; i++){
        let randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        let randomChar = randomCharacter.charAt(Math.floor(Math.random() * randomCharacter.length));
        id += randomChar;
    }
    return id;
}



module.exports = uuid;