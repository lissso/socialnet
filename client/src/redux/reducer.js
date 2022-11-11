import { combineReducers } from "redux";
import charactersReducer from "./characters/slice.js";

const rootReducer = combineReducers({
    characters: charactersReducer,
});

export default rootReducer;

