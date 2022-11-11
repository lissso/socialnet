import { io } from "socket.io-client";
import { chatMessagesReceived, addNewMessage } from "./redux/messages/slice.js";

export let socket;

export const init = (store) => {
    if (!socket) {
        //only establish a socket connection once
        socket = io.connect();
        /* we'll later add all sorts of sockets that we want to listen to later on...*/

        socket.on("last-10-messages", (msgs) => {
            store.dispatch(chatMessagesReceived(msgs.messages.reverse()));
            // console.log("server just emitted last-20-messages", msgs);
            // time to dispatch an action messages/received would be a good one
            // pass to action creator the messages your server emitted
        });

        socket.on("add-new-message", (msg) => {
            store.dispatch(addNewMessage(msg));
            // console.log("server just emitted a new msg to add", msg);
            // time to dispatch an ection message/addNew would be a good one
            // pass to action the object containing the message, and the user info
            // of the author
        });
    }
};
