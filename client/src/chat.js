import { useSelector } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";

export default function Chat() {
    const messages = useSelector((state) => state.messages);
    const chatContainerRef = useRef();
    useEffect(() => {
        // console.log("chat just mounted");
        // console.log("chatContainerRef", chatContainerRef);
        // console.log("scrollTop", chatContainerRef.current.scrollTop);
        // console.log("clientHeight", chatContainerRef.current.clientHeight);
        // console.log("scrollHeight", chatContainerRef.current.scrollHeight);
        // on first mount and every time a new message gets added
        // we want to adjust our elements scrollTop to be the scrollHeight minus height
        // of the element, as that means we are scrolled to the bottom msg
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight -
            chatContainerRef.current.clientHeight;
    }, [messages]);
    const keyCheck = (e) => {
        console.log("what was pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("what's the value of our input field", e.target.value);
            // time to let the server there is a new message
            socket.emit("new-message", e.target.value);
            // after emitting our msg, we clear the textarea
            e.target.value = "";
        }
    };

    console.log("messages in chat", messages);
    return (
        <>
            <h1 className="chat">Chat with friends</h1>
            <div className="container-chat" ref={chatContainerRef}>
                {messages.messages &&
                    messages.messages.map((message) => {
                        return (
                            <div
                                className="conatiner-one-chat img-margin"
                                key={message.id}
                            >
                                <img
                                    className="image-small "
                                    src={message.imageurl || "default.png"}
                                />
                                <p className="chat-user-name">
                                    {message.first} {message.last}
                                    <br />
                                    <span className="user-name">
                                        {message.message}
                                    </span>
                                </p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                className="chat-area"
                onKeyDown={keyCheck}
                placeholder="Chime in, and add messages here"
            ></textarea>
        </>
    );
}
