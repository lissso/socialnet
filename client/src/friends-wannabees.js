// import { combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    makeFriend,
    receivedFriends,
    deleteFriend,
} from "./redux/friends/slice";

export default function FriendsAndWannabees() {
    // This gives you access to the dispatch function
    const dispatch = useDispatch();

    const wannabees = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => !friend.accepted)
    );

    const friends = useSelector(
        (state) =>
            state.friends && state.friends.filter((friend) => friend.accepted)
    );

    useEffect(() => {
        (async () => {
            const res = await fetch("/friends-wannabees");
            const data = await res.json();
            // console.log("data in friends: ", data);
            dispatch(receivedFriends(data.payload));
        })();
    }, []);

    const handleAccept = async (id) => {
        const res = await fetch(`/accept-friend/${id}`, { method: "POST" });
        const data = await res.json();

        if (data.success) {
            dispatch(makeFriend(id));
        }
    };

    const handleDelete = async (id) => {
        // console.log("deleteFriend", id);

        const res = await fetch(`/unfriend/${id}`, { method: "POST" });
        const data = await res.json();
        // console.log(data);

        if (data.success) {
            dispatch(deleteFriend(id));
        }
    };

    // const handleButton = (action, id) => {
    //     (async () => {
    //         try {
    //             const respBody = await fetch(`/friendship/${action}/${id}`, {
    //                 method: "POST",
    //             });
    //             const data = await respBody.json();
    //             // console.log("data in fetch friendship: ", data);
    //             if (data.success) {
    //                 return;
    //             }
    //         } catch (err) {
    //             console.log("err on fetch handleButton", err);
    //         }
    //     })();
    //     if (action === "accept") {
    //         dispatch(makeFriend(id));
    //     } else if (action == "remove") {
    //         dispatch(removeFriend(id));
    //     } else {
    //         dispatch(rejectFriend(id));
    //     }
    // };

    return (
        <>
            <section>
                <h1>Friends</h1>
                <div className="container-find-people">
                    {friends.map((friend) => {
                        return (
                            <div className="" key={friend.id}>
                                <Link
                                    className="link-profile"
                                    to={`user/${friend.id}`}
                                >
                                    <img
                                        className="image-medium img-margin"
                                        src={friend.imageurl}
                                    />
                                    <p className="user-name">
                                        {friend.first} <br /> {friend.last}
                                    </p>
                                </Link>
                                <button
                                    className="button-friends"
                                    onClick={() => handleDelete(friend.id)}
                                >
                                    End ☹︎
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="margin-friends">
                    <h1>Wannabees</h1>
                    <div className="container-find-people">
                        {wannabees.map((wannabee) => {
                            return (
                                <div key={wannabee.id}>
                                    <img
                                        className="image-medium img-margin"
                                        src={wannabee.imageurl}
                                    />
                                    <div className="user-name">
                                        {wannabee.first} {wannabee.last}
                                    </div>
                                    <button
                                        className="button-wanna"
                                        onClick={() =>
                                            handleAccept(wannabee.id)
                                        }
                                    >
                                        Accept ☯︎
                                    </button>
                                    {/* <button onClick={() => handleDelete(wannabee.id)}>
                                End ☹︎
                            </button> */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
