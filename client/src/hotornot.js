import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveCharacters,
    makeHot,
    makeNot,
} from "./redux/characters/slice.js";

export default function HotOrNot() {
    const dispatch = useDispatch();
    const characters = useSelector(
        (state) =>
            state.characters &&
            state.characters.filter((character) => character.hot == null)
    );

    // console.log("characters from global state", characters);

    useEffect(() => {
        if (!characters) {
            (async () => {
                const res = await fetch("/characters");
                const data = await res.json();
                dispatch(receiveCharacters(data.characters));
            })();
        }
    }, []);

    const handleHot = async (id) => {
        console.log("clicked opn hot button", id);

        const res = await fetch(`/hot/${id}`, { method: "POST" });
        const data = await res.json();

        if (data.success) {
            dispatch(makeHot(id));
        }

        //console.log(`data from /hot/${id}`, data);
    };

    const handleNot = async (id) => {
        //console.log("clicked opn hot button", id);

        const res = await fetch(`/not/${id}`, { method: "POST" });
        const data = await res.json();

        if (data.success) {
            dispatch(makeNot(id));
        }

        //console.log(`data from /hot/${id}`, data);
    };

    if (!characters) {
        return null;
    }

    return (
        <div id="hot-or-not">
            {characters[0] ? (
                <div className="character">
                    <img src={characters[0].image} />
                    <div className="buttons">
                        <button onClick={() => handleHot(characters[0].id)}>
                            Hot
                        </button>
                        <button onClick={() => handleNot(characters[0].id)}>
                            Not
                        </button>
                    </div>
                </div>
            ) : (
                "Everybody is already hot or not"
            )}
            <nav>
                <Link to="/hot">See who&apos;s hot</Link>
                <Link to="/not">See who&apos;s not</Link>
            </nav>
        </div>
    );
}
