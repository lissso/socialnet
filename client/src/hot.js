import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeNot } from "./redux/characters/slice.js";

export default function Hot() {
    const dispatch = useDispatch();
    const characters = useSelector(
        (state) =>
            state.characters &&
            state.characters.filter((character) => character.hot)
    );

    if (!characters) {
        return null;
    }

    const hotCharacters = (
        <div className="characters">
            {characters.map((character) => (
                <div className="character" key={character.id}>
                    <img src={character.image} />
                    <div className="buttons">
                        <button onClick={() => dispatch(makeNot(character.id))}>
                            Not
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
    return (
        <div id="hot">
            {!characters.length && <div>Nobody is hot!</div>}
            {!!characters.length && hotCharacters}
            <nav>
                <Link to="/">Home</Link>
                <Link to="/not">See who&apos;s not</Link>
            </nav>
        </div>
    );
}
