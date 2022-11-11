//Rducer
export default function charactersReducer(characters = null, action) {
    if (action.type == "characters/receivedCharacters") {
        characters = action.payload.characters;
    }

    if (action.type == "characters/madeHot") {
        characters = characters.map((character) => {
            if (character.id === action.payload.id) {
                return {
                    ...character,
                    hot: true,
                };
            } else {
                return character;
            }
        });
    }

    if (action.type == "characters/madeNot") {
        characters = characters.map((character) => {
            if (character.id === action.payload.id) {
                return {
                    ...character,
                    hot: false,
                };
            } else {
                return character;
            }
        });
    }

    return characters;
}

// Action Creator
export function receiveCharacters(characters) {
    return {
        type: "characters/receivedCharacters",
        payload: { characters },
    };
}

export function makeHot(id) {
    console.log("id inside makeHot", id);

    return {
        type: "characters/madeHot",
        payload: { id },
    };
}

export function makeNot(id) {
    console.log("id inside makeNot", id);

    return {
        type: "characters/madeNot",
        payload: { id },
    };
}
