import { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
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
            },
            () => console.log("this.state: ", this.state)
        );
    }

    handleSubmit() {
        // console.log("clicked on submit button");
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST /login.json: ", data);

                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((err) => {
                // if something goes wrong => render an error
                console.log("login went wrong", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="wrapper-login">
                <div className="one-login">
                    <img src="../ocean.jpg" />
                </div>
                <div className="container-login">
                    <h1 className="login">
                        OCEAN <span className="vibes">vives</span>
                    </h1>
                    <img className="login" src="../wave.svg" alt="wave" />

                    <h4>Log in to your Account:</h4>

                    {this.state.error && (
                        <p className="error">oops! something went wrong!</p>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button
                        className="login"
                        onClick={() => this.handleSubmit()}
                    >
                        Submit
                    </button>

                    <p className="login">
                        No Account yet?
                        <Link to="/">Click here to Register!</Link>
                    </p>

                    <p className="login">
                        Forgot password?
                        <Link to="/reset">Click here reset your password!</Link>
                    </p>
                </div>
            </div>
        );
    }
}
