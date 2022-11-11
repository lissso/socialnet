import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveCharacters } from "./redux/characters/slice.js";

export default function HotOrNot() {
    const dispatch = useDispatch();
    const characters = useSelector(
        state => state.characters && state.characters.filter(
            character => character.hot == null
        )
    );

    useEffect(() => {
        if (!characters) {
            (async () => {
                const res = await fetch("/characters");
                const data = await res.json();
                dispatch(receiveCharacters(data.characters));
            })();
        }
    }, []);

    if (!characters) {
        return null;
    }

    return (
        <div id="hot-or-not">
            {characters[0] ? (
                <div className="character">
                    <img src={characters[0].image} />
                    <div className="buttons">
                        <button>Hot</button>
                        <button>Not</button>
                    </div>
                </div>
            ) : 'Everybody is already hot or not'}
            <nav>
                <Link to="/hot">See who&apos;s hot</Link>
                <Link to="/not">See who&apos;s not</Link>
            </nav>
        </div>
    );
}
