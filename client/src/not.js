import { Link } from "react-router-dom";

export default function Not() {
    const characters = null;
    if (!characters) {
        return null;
    }
    const notCharacters = (
        <div className="characters">
            {characters.map(character => (
                <div className="character" key={character.id}>
                    <img src={character.image} />
                    <div className="buttons">
                        <button>Hot</button>
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
