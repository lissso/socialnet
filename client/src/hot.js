import { Link } from "react-router-dom";

export default function Hot() {
    const characters = null;
    if (!characters) {
        return null;
    }
    const hotCharacters = (
        <div className="characters">
            {characters.map(character => (
                <div className="character" key={character.id}>
                    <img src={character.image} />
                    <div className="buttons">
                        <button>Not</button>
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
