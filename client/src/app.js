import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Profile from "./Profile";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import FindPeople from "./findPeople";
import Logo from "./logo";
import OtherProfile from "./otherProfile";
import FriendsAndWannabees from "./friends-wannabees";
import Chat from "./chat";
// import Logout from "./logout";
// import useSticky from "./stickyNav";
// import classNames from "classnames";

// import Profile from "./profile";
// this will be our entry point to the entire social network once the user is logged in, or when the successfully register for the 1st time
// App will be a wrapper componet that will contain everything inside
export default class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            imageUrl: "",
            uploaderIsVisible: false,
            bio: "",
        };

        // this.toggleModal = this.toggleModal.bind(this);
    }

    // this function runs the second the component is rendered!
    componentDidMount() {
        console.log("App mounted!");
        // HERE is where we want to make a fetch request to 'GET' info about logged in or newly registered user
        // we care about: first name, last name, profilepicurl (we don't have yet)
        // the route `/user.json` is a good path for it
        // when we have the info from the server, add it to the state of this component using setState.
        fetch("/user")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from GET /user.json: ", data);

                this.setState({
                    first: data.profile.first,
                    last: data.profile.last,
                    imageUrl: data.profile.imageurl,
                    bio: data.profile.bio,
                    uploadIsVisible: false,
                });
            })
            .catch((err) => {
                console.log("error is", err);
            });
    }

    toggleModal() {
        // console.log("toggleModal fn is running!");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    // this fn is responsible for receiving your imageUrl from uploader
    // and then storing it to its state
    submitPicToApp(imageUrl) {
        this.setState({ imageUrl: imageUrl });
        console.log(
            "method is running in App and argument passed to it is: ",
            imageUrl
        );

        // make sure you set the imageUrl you received from uploader in state!
    }

    setBio(newBio) {
        // the responsibility of this fn is to store this argument in Apps state
        // this function is created in App but needs to be called in BioEditor
        // it expects to be passed the official bio
        // make sure you log the argument to ensure you're actually getting it from BioEditor
        this.setState({
            bio: newBio,
        });
    }
    logoutFun() {
        // an fetch tom sesrver for the logout.
        fetch("/logout")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    location.reload();
                }
            });
    }
    render() {
        // console.log("this.state in app: ", this.state);        const { sticky, stickyRef } = useSticky();
        return (
            <div className="">
                <BrowserRouter>
                    <div className="top-container">
                        <h1>Scroll Down</h1>
                        <p>Scroll down to see the sticky effect</p>
                    </div>

                    <nav>
                        <Link to="/">
                            <Logo />
                        </Link>
                        <div className="menu">
                            <Link to="/">Profile</Link>
                            <Link to="/find">Find People</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/chat">Chat</Link>
                            <Link to="/login" onClick={this.logoutFun}>
                                Logout
                            </Link>

                            <div className="container-profile-pic">
                                <ProfilePic
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    modCallback={() => this.toggleModal()}
                                />
                            </div>
                        </div>
                    </nav>

                    <div className="container-app main">
                        <Route exact path="/">
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                bio={this.state.bio}
                                setBio={(arg) => this.setBio(arg)}
                                modCallback={() => this.toggleModal()}
                            />
                        </Route>

                        <Route path="/friends">
                            <FriendsAndWannabees />
                        </Route>

                        <Route exact path="/find">
                            <FindPeople />
                        </Route>

                        <Route path="/user/:otherUserId">
                            <OtherProfile />
                        </Route>

                        <Route path="/chat">
                            <Chat />
                        </Route>

                        {this.state.uploaderIsVisible && (
                            <Uploader
                                modCallback={() => {
                                    this.toggleModal();
                                }}
                                submitPicToApp={(imageUrl) =>
                                    this.submitPicToApp(imageUrl)
                                }
                            />
                        )}
                    </div>
                </BrowserRouter>
                <footer className="footer">
                    <p className="footer">Funky chicken</p>
                </footer>
            </div>
        );
    }
}
