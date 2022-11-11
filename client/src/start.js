// import HelloWorld from "./helloworld.js";

// ReactDOM.render(<HelloWorld />, document.querySelector("main"));
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import App from "./App";

import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducer";
import { init } from "./socket";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// ReactDOM.render(<Welcome />, document.querySelector("main"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        // console.log("data in start.js: ", data.userId);
        if (!data.userId) {
            // this means that the user doens't have a userId and should see Welcome/Registration for now
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // this means the user is registered cause their browser DID have the right cookie
            //and they should be seeing a logo
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,

                document.querySelector("main")
            );
        }
    });
