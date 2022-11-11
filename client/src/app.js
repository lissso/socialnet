import { BrowserRouter, Route } from "react-router-dom";
import HotOrNot from "./hotornot";
import Hot from "./hot";
import Not from "./not";

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <HotOrNot />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}