// Reducer for messages ----------------------------------------
export default function messagesReducer(messages = [], action) {
    if (action.type === "messages/received") {
        // console.log("action in reducer", action);
        messages = action.payload;
    }
    if (action.type === "message/add") {
        // console.log("action in reducer", action);
        // console.log("action in message add", messages);
        messages = { messages: [...messages.messages, action.payload.message] };
    }
    return messages;
}

// Action Creators ---------------------------------------------
export function chatMessagesReceived(messages) {
    // console.log("in action creator");
    // console.log("messages", messages);
    return {
        type: "messages/received",
        payload: { messages },
    };
}

export function addNewMessage(message) {
    // console.log("in action creator new message");
    // console.log("message new msg", message);
    return {
        type: "message/add",
        payload: { message },
    };
}
