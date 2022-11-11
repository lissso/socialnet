export default function charactersReducer(characters=null, action) {
    if (action.type == "characters/receivedCharacters") {
        characters = action.payload.characters;
    }
    return characters;
}

export function receiveCharacters(characters) {
    return {
        type: "characters/receivedCharacters",
        payload: { characters },
    };
}
