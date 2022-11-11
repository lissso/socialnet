import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";

export default function Welcome() {
    return (
        <div id="welcome">
            {/* <h1>Welcome!</h1> */}
            {/* <img src="/logo.jpeg" /> */}
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
