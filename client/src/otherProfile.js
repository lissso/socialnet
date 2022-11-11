import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import FriendButton from "./friendButton";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    // const params = useParams();
    const { otherUserId } = useParams(); // otherUserId <---- this name depends
    // on what you    called this inside your
    // path of the Route in app.js
    const history = useHistory();

    console.log("history:", history);

    useEffect(() => {
        let abort = false;
        if (!abort) {
            (async () => {
                try {
                    console.log("otherUserId", otherUserId);
                    const respBody = await fetch("/api/user/" + otherUserId);
                    const data = await respBody.json();
                    // console.log("respBody", respBody);
                    console.log("data other profile: ", data);
                    if (data.ownProfile) {
                        console.log("own profile");
                        history.push("/");
                    } else if (!abort) {
                        setUser(data.profile);
                    } else {
                        // console.log("ignore: don't run a state update");
                    }
                } catch (err) {
                    console.log("err on fetch other profile");
                }
            })();
        }
        return () => {
            abort = true;
        };
    }, []);
    return (
        <>
            <div className="wrapper-profile-other">
                <div className="one-otherprofile ">
                    {(user && (
                        <h1>
                            {user.first} {user.last}
                        </h1>
                    )) || <h1>User not found!</h1>}
                </div>
                <div className=" two-otherprofile flex-start">
                    {user && (
                        <img
                            className="image-large"
                            src={user.imageurl || "/default.png"}
                            alt={`${user.first + user.last}`}
                        />
                    )}
                    {user && <FriendButton otherUserId={otherUserId} />}
                </div>
                <div className="three-otherprofile">
                    {(user && user.bio && (
                        <div id="bioText">
                            <div>
                                <h3>Bio:</h3>
                                <p>{user.bio}</p>
                            </div>
                        </div>
                    )) ||
                        (user && (
                            <div id="bioText">
                                <div className="flexStart">
                                    <p>No bio yet</p>
                                </div>
                            </div>
                        ))}
                </div>

                {/* <h2>renders name+ bio + picture if valid user is found</h2>
                <h2>
                    renders error of 404 if user could not be found or replaces
                    the value of our route with /
                </h2>
                <h2>
                    changes UI to editable profile if we try to access our own
                    profile
                </h2> */}
            </div>
        </>
    );
}
