import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorIsVisible: false,
            draftBio: "",
        };
    }

    handleBioChange(e) {
        // in here, you want to keep track of the draft bio that the user types
        // store whatever that value is in bioEditor's state as the 'draftBio'
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    editActive() {
        this.setState({ editorIsVisible: true, draftBio: this.props.bio });
    }

    // toggleBioEditor() {
    //     this.setState({
    //         editorIsVisible: !this.setState.editorIsVisible,
    //     });
    // }

    // the bio that the user types in the bioeditor component's text area is the DRAFT BIO
    // the bio tht the user submits and is successfully inserted into the db and sent back is the OFFICIAL BIO which should live in APP

    submitBio() {
        console.log("neue bio", this.state.draftBio);
        // this should run whenever the user clicks save / submit (whenever they're done writing their bio)
        // TODO:
        // 1. make a fetch POST request and send along the draftbio the user typed (this.state.draftBio)
        // 2. make sure you send the newly inserted bio from the server back to bioEditor
        // 3. once you see it, make sure you send this newly inserted bio back to APP as this newly inserted bio / official bio will live in the state of App
        // the bio that lives in App's state is the official one ✅
        // you can do something like -> this.props.setBio(newBio)
        fetch("/upload/profile/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.draftBio,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((resp) => resp.json())
            .then((data) => {
                // console.log("data", this.props);
                this.props.setBio(data.payload.bio);
                this.setState({
                    editorIsVisible: false,
                });
            })
            .catch((err) => {
                console.log("err in submitBio", err);
            });
    }

    render() {
        // console.log("props", this.props);
        return (
            <div className="container-bio ">
                <h1 className="bio">I am the bio editor</h1>
                <div className="text-margin">
                    {!this.state.editorIsVisible && this.props.bio && (
                        <div>
                            <p>{this.props.bio}</p>
                            <button onClick={() => this.editActive()}>
                                edit
                            </button>
                        </div>
                    )}
                    {!this.state.editorIsVisible && !this.props.bio && (
                        <div>
                            <button onClick={() => this.editActive()}>
                                add bio
                            </button>
                        </div>
                    )}
                    {this.state.editorIsVisible && (
                        <div className="flex-start">
                            <textarea
                                className="bio-area"
                                name="draftBio"
                                defaultValue={this.props.bio}
                                onChange={(e) => this.handleBioChange(e)}
                            ></textarea>
                            <button onClick={() => this.submitBio()}>
                                Submit Bio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

/* Do your rendering logic in here!
It all depends on whether you are on edit more or not.
Whenever they click on the add or edit button, you are on edit mode - show the text area!

            If showTextArea is true, then render the text area with a button that says save / submit
            If you're not adding or editing a bio, then you should NOT see the text area
            If you're NOT in edit mode, THEN check to see if there is a bio!

            if there is a bio, allow them to EDIT a bio!
            if there is NO bio, allow them to ADD a bio! */
