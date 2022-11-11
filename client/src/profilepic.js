// pass 'props' as an argument to get access to the info being passed down from the parent (App)

// Approach #1 - using destructuring
export default function ProfilePic({ first, last, imageUrl, modCallback }) {
    // console.log("info being passed down from App: ", props);
    imageUrl = imageUrl || "/default.png";

    return (
        <div>
            {/* <h2>
                This is the profile picture componet. My name is {first} and my last name is {last}
            </h2> */}
            <img
                onClick={modCallback ? () => modCallback() : null}
                className="profile-pic"
                src={imageUrl}
                alt={first + last}
            />
        </div>
    );
}

// Approach #2 - using object notation
// pass 'props' as an argument to get access to the info being passed down from the parent (App)

// export default function Presentational(props) {
//     console.log("info being passed down from App: ", props);

//     return (
//         <div>
//             <h2>
//                 This is the presentational componet. My name is {props.first}
//                 and my last name is {props.last}
//             </h2>
//             <img
//                 className="profile-pic"
//                 src={props.imageUrl}
//                 alt="Layla Arias"
//             />
//         </div>
//     );
// }
