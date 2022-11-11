import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [newUsers, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        let abort = false;
        fetch(`/users?userSearch=${searchInput}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (!abort) {
                    setUsers(data.payload);
                } else {
                    console.log("ignore");
                }
            })
            .catch((err) => {
                console.log("error", err);
            });
        return () => {
            abort = true;
        };
    }, [searchInput]);

    return (
        <div className="container-find">
            {!searchInput && <h1 className="chat">See the latest users!</h1>}
            <p className="text-margin">Looking for someone else?</p>

            <input
                className="input-field1"
                onChange={(e) => setSearchInput(e.target.value)}
                name="userSearch"
                type="text"
                placeholder="Enter name"
                value={searchInput}
            />
            <div className="container-find-people">
                {newUsers &&
                    newUsers.map((newUsers) => {
                        return (
                            <div key={newUsers.id}>
                                <Link
                                    className="link-profile"
                                    to={`user/${newUsers.id}`}
                                >
                                    <img
                                        className="image-medium img-margin"
                                        src={
                                            newUsers.imageurl || "/default.png"
                                        }
                                        alt={(newUsers.first, newUsers.last)}
                                    />
                                    <p className="user-name">
                                        {newUsers.first} <br />
                                        {newUsers.last}
                                    </p>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
