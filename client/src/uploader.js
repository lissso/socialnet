import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        console.log("props inside Uploader: ", props);
    }

    componentDidMount() {
        console.log("uploader just mounted");
    }

    uploadPic(e) {
        e.preventDefault();

        fetch("/upload", {
            method: "POST",
            body: new FormData(e.target),
        })
            .then((res) => res.json())
            .then((data) => {
                this.props.submitPicToApp(data.payload.imageurl);
                this.props.modCallback();
            })
            .catch((err) => {
                console.log("error is in uploadPic ", err);
            });
        // console.log("method in uploader running!!");

        // this is where you'll be doing formdata to send your image to the server!!
        // look back at ib for a nice little refresher.
        // once the img has been successfully added to the db and you get the image back here,
        // you'll want to send the image UP TO APP - you can do so by calling the method in App
        // this method in App was passed down to uploader!

        // make sure that the newly inserted image url that you pass to the method in app is the one you got back from the db!

        // calling the function that lives in app via props!
        this.props.submitPicToApp("whoaaaaa");
        // don't forget to also hide your uploader automatically - call the fn in app that is responsible for toggling the uploader
    }

    render() {
        return (
            <div className="container-uploader wrapper-flex-column">
                <div className="wrapper-uploader">
                    <h2 className="uploader-text">
                        Update your profile picture
                    </h2>
                    <form
                        className="wrapper-flex-column"
                        onSubmit={(e) => this.uploadPic(e)}
                    >
                        <label className="uploader-button" htmlFor="input-tag">
                            <img src="../camera.svg" alt="Upload Image" />
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                id="input-tag"
                                required
                            />
                        </label>
                        <button className="uploader">Save</button>
                    </form>
                </div>
            </div>
        );
    }
}

/* <button onClick={() => this.uploadPic()}>Submit !</button> */

/* <h2
                    onClick={() => this.props.modCallback()}
                    className="closeModal"
                >
                    X
                </h2> */
