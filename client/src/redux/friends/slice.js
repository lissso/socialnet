// redux/friends/slice.js

// this is our friends-wannabees sub-reducer
// in here- we MUST make copies for every array and object
// no mutating allowed!

export default function friendsWannabeesReducer(friends = [], action) {
    if (action.type === "/friends-wannabees/received") {
        console.log("PAYLOAD: ", action.payload);
        friends = action.payload;
        //
    }

    if (action.type === "/friends-wannabees/accept") {
        // const newFriendsWannabees = friendsWannabees.map( do your logic here)
        // return newFriendsWannabees;
        friends = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return { ...friend, accepted: true };
            } else {
                return friend;
            }
        });
    }
    if (action.type === "/friends-wannabees/unfriend") {
        friends = friends.filter((friend) => {
            if (friend.id != action.payload.id) {
                return friend;
            }
        });
    }

    return friends;
}

// Actions go below

export function makeFriend(id) {
    return {
        type: "/friends-wannabees/accept",
        payload: { id },
    };
}
export function receivedFriends(userArr) {
    return {
        type: "/friends-wannabees/received",
        payload: userArr,
    };
}
export function deleteFriend(id) {
    return {
        type: "/friends-wannabees/unfriend",
        payload: { id },
    };
}

// var obj = {
//     name: "Layla",
// };

// var newObj = { ...obj };
// var newObj = { ...obj, last: "Arias" };

// var aarr = [1, 2, 3];
// var newArr = [...arr];
// var newArr = [...arr, 4];
