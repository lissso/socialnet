import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeHot } from "./redux/characters/slice.js";

export default function Not() {
    const dispatch = useDispatch();
    const characters = useSelector(
        (state) =>
            state.characters &&
            state.characters.filter((character) => character.hot === false)
    );

    if (!characters) {
        return null;
    }



    const notCharacters = (
        <div className="characters">
            {characters.map((character) => (
                <div className="character" key={character.id}>
                    <img src={character.image} />
                    <div className="buttons">
                        <button onClick={() => dispatch(makeHot(character.id))}>
                            Hot
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
    return (
        <div id="not">
            {!characters.length && <div>Nobody is not hot!</div>}
            {!!characters.length && notCharacters}
            <nav>
                <Link to="/">Home</Link>
                <Link to="/hot">See who&apos;s hot</Link>
            </nav>
        </div>
    );
}
