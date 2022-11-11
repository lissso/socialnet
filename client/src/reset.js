import { Component } from "react";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
            view: 1,
        };
        // One way to bind 'this
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        // console.log(
        //     "handleChange is running - user is typing in the input field"
        // );
        // console.log(e.target.value);
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            //() => console.log("this.state: ", this.state)
        );
    }

    verifyEmail() {
        // console.log("clicked on submit button");
        fetch("/password/reset/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data.success", data.success);
                if (data.success) {
                    this.setState({
                        view: 2,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("error in verify email", err);
                this.setState({
                    error: true,
                });
            });
    }

    newPassword() {
        fetch("password/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        view: 3,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                console.log("newPassword went wrong", err);
                this.setState({
                    error: true,
                });
            });
    }

    determineViewToRender() {
        // this method determines what the render!
        if (this.state.view === 1) {
            return (
                <div>
                    <h1>Reset Password</h1>
                    <p>Please enter the email address you registered</p>

                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.verifyEmail()}>Submit</button>
                </div>
            );
        } else if (this.state.view === 2) {
            return (
                <div>
                    <h1>Reset Password</h1>
                    <p>Please enter the code you receive</p>
                    <input
                        type="text"
                        name="code"
                        placeholder="code"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <p>Please enter the new password you receive</p>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.newPassword()}>Submit</button>
                </div>
            );
        } else if (this.state.view === 3) {
            // remember to also add a link to login ;)
            return (
                <div>
                    <h1>Reset Passsword!</h1>
                    <h2>Reset Passsword!</h2>
                    <p>
                        You have successfully updated your password! Click
                        <Link to="/login">here</Link> to Log in!
                    </p>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {/* call the method */}
                {this.determineViewToRender()}
            </div>
        );
    }
}
