const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const characters = [
    {
        id: 1,
        name: "Mario",
        image:
            "https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png",
    },
    {
        id: 2,
        name: "Hello Kitty",
        image:
            "https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png",
    },
    {
        id: 3,
        name: "Homer Simpson",
        image:
            "https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png",
    },
    {
        id: 4,
        name: "Maleficent",
        image:
            "https://upload.wikimedia.org/wikipedia/en/7/7e/Malefica.jpg",
    },
    {
        id: 5,
        name: "Chewbacca",
        image:
            "https://upload.wikimedia.org/wikipedia/en/1/12/Chewbaca_%28Peter_Mayhew%29.png",
    },
    {
        id: 6,
        name: "Miss Piggy",
        image: "https://upload.wikimedia.org/wikipedia/en/2/22/MissPiggy.jpg",
    },
    {
        id: 7,
        name: "Pikachu",
        image:
            "https://upload.wikimedia.org/wikipedia/en/7/73/Pikachu_artwork_for_Pok%C3%A9mon_Red_and_Blue.webp",
    },
    {
        id: 8,
        name: "Caesar",
        image:
            "https://upload.wikimedia.org/wikipedia/en/c/ce/Caesar_Planet_of_the_Apes.jpeg",
    },
    {
        id: 9,
        name: "Asterix",
        image: "https://upload.wikimedia.org/wikipedia/en/f/f6/Asterix1.png",
    },
];

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/characters", (req, res) => res.json({ characters }));

app.post("/hot/:id", (req, res) => {
    const character = characters.find(
        character => character.id == req.params.id
    );
    if (character) {
        character.hot = true;
    }
    res.json({
        success: !!character,
    });
});

app.post("/not/:id", (req, res) => {
    const character = characters.find(
        character => character.id == req.params.id
    );
    if (character) {
        character.hot = false;
    }
    res.json({
        success: !!character,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
