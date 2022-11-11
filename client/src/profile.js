import Bio from "./bioEditor";
import ProfilePic from "./profilepic";
import FindPeople from "./findPeople";
import Chat from "./chat";

export default function Profile(props) {
    // console.log("props in profile: ", props);

    return (
        <div className="container-profile">
            <div className="wrapper-profile">
                <div className=" headline one line padding-grid">
                    <h1 className="login">
                        OCEAN <span className="vibes">vives</span>
                    </h1>
                </div>
                <div className="two padding-grid">
                    <h1 className="greeting">
                        Hi {props.first}! Good to see you!
                    </h1>
                </div>
                <div className="profile three color padding-grid line-yellow">
                    <ProfilePic
                        first={props.first}
                        last={props.last}
                        imageUrl={props.imageUrl}
                    />
                </div>
                <div className="four color padding-grid line-yellow">
                    <Bio bio={props.bio} setBio={props.setBio} />
                </div>
                <div className="wavy eight">
                    <img className="wave-image" src="../wavy.svg" alt="wave" />
                </div>
                <div className="five color padding-grid">
                    <FindPeople />
                </div>
                <div className="six padding-grid">
                    <Chat />
                </div>
            </div>
        </div>
    );
}
