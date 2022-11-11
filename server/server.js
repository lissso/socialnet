const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const bcrypt = require("./bcrypt");
const cookieSession = require("cookie-session");
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const s3 = require("./s3");
const s3Url = "https://s3.amazonaws.com/spicedling/";
const uidSafe = require("uid-safe");
const { sendEmail } = require("./ses.js");
//part 10
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
/*
 ********************** - Middlewear - **********************
 */
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
// same like path join =>  app.use(express.static("../client/public"));

app.use(
    express.urlencoded({
        extended: false,
    })
);
// console.log("COOKIE_SECRET", COOKIE_SECRET);
// console.log("process.env", process.env);
const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});
//this gives sockets access to our request object upon connectsion! So that means we know
// which userid belongs to which socket upon connecting!
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(cookieSessionMiddleware);

// app.use((req, res, next) => {
//     console.log("---------------------");
//     console.log("req.url:", req.url);
//     console.log("req.method:", req.method);
//     console.log("req.session:", req.session);
//     console.log("---------------------");
//     next();
// });

/*
 ********************** - GET User - **********************
 */
app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("/user", (req, res) => {
    db.getUser(req.session.userId)
        .then((result) => {
            // console.log("result.rows in /user: ", result.rows);
            const profile = result.rows[0];
            res.json({
                success: true,
                profile,
            });
        })
        .catch((err) => {
            console.log("error in app.get user ", err);
            res.json({
                success: false,
                error: true,
            });
        });
});

app.get("/api/user/:id", (req, res) => {
    // console.log("req.params.id", req.params.id);
    // console.log("rreq.session", req.session);

    if (req.params.id == req.session.userId) {
        return res.json({
            ownProfile: true,
            ownId: req.session.userId,
        });
    }

    db.getUser(req.params.id)
        .then((result) => {
            if (result.rows[0]) {
                const profile = result.rows[0];
                res.json({
                    success: true,
                    profile,
                });
            } else {
                console.log("no user found");
                res.json({ noUser: true });
            }
        })
        .catch((err) => {
            console.log("error in app.getuser:id ", err);
            res.json({
                success: false,
                error: true,
            });
        });
});

app.get("/users", (req, res) => {
    if (req.query.userSearch) {
        // console.log("user search", req.query.userSearch);
        db.getMatchingUsers(req.query.userSearch, req.session.userId)
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows,
                });
            })
            .catch((err) => {
                console.log("error", err);
            });
    } else {
        db.getRecentUsers(req.session.userId)
            .then((result) => {
                res.json({
                    success: true,
                    payload: result.rows,
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
});

/*
 ********************** - register User - **********************
 */
app.post("/registration", (req, res) => {
    // console.log("register: req.body", req.body);
    bcrypt
        .hash(req.body.password)
        .then((hashPwd) => {
            // console.log("results hash", hashPwd);
            return db
                .registerUser(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashPwd
                )
                .then((result) => {
                    // console.log("results hash USER", hashPwd);
                    // console.log("results row", result);

                    req.session.userId = result.rows[0].id;

                    // console.log("I am in side user registraion");

                    res.json({ success: true });

                    // res.redirect("/profile");
                });
        })
        .catch((err) => {
            res.json({ success: false, error: true });
            console.log("err in db.hash:", err);
        });
});
/*
 ********************** - Login - **********************
 */
app.post("/login", (req, res) => {
    // console.log("result email body: ", req.body.email);
    db.getEmail(req.body.email)
        .then((result) => {
            // console.log("result email: ", result.rows);
            if (result.rows[0]) {
                bcrypt
                    .compare(req.body.password, result.rows[0].password)
                    .then((isMatched) => {
                        // console.log("result bcrypt: ", result);
                        // console.log("after password match");
                        if (isMatched) {
                            req.session.userId = result.rows[0].id;
                            res.json({
                                success: true,
                            });
                            // res.redirect("/");
                        }
                    })
                    .catch((err) => {
                        console.log("err in compare:", err);
                    });
            } else {
                res.json({
                    success: false,
                    error: true,
                });
            }
        })
        .catch((err) => {
            console.log("err in login User: ", err);
            res.json({ error: true });
        }); //end of catch;
});
/*
 ********************** - Reset Password - **********************
 */
app.post("/password/reset/start", (req, res) => {
    db.getEmail(req.body.email)
        .then((results) => {
            // console.log("reset start results", results);
            if (results.rows.length > 0) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                // console.log("secret code", secretCode);
                db.addCode(req.body.email, secretCode)
                    .then(() => {
                        sendEmail(secretCode, "Password Reset");
                    })
                    .then(res.json({ success: true }))
                    .catch((err) => {
                        console.log("error in db.verifying user's email ", err);
                        res.json({
                            success: false,
                            error: true,
                        });
                    });
            } else {
                res.json({
                    success: false,
                    error: true,
                });
            }
        })
        .catch((err) => {
            console.log("err in /password/reset/start =>", err);
            //error message
            res.render("reset", {
                error: true,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    if (req.body.password && req.body.code) {
        db.getCode(req.body.email).then((results) => {
            if (req.body.code === results.rows[0].code) {
                bcrypt
                    .hash(req.body.password)
                    .then((hashPwd) => {
                        const hashPassword = hashPwd;
                        // console.log("req.body.email is", req.body.email);
                        // needs to be a return to handle the catch
                        return db
                            .updatePassword(hashPassword, req.body.email)
                            .then(() => res.json({ success: true }))
                            .catch((err) => {
                                console.log(
                                    "err in /password/reset/verify",
                                    err
                                );
                                res.json({
                                    success: false,
                                    error: true,
                                });
                            });
                    })
                    .catch((err) => {
                        console.log("err in /password/reset/verify", err);
                        res.json({
                            success: false,
                            error: true,
                        });
                    });
            } else {
                res.json({
                    success: false,
                    error: true,
                });
            }
        });
    } else {
        res.json({
            success: false,
            error: true,
        });
    }
});

/*/////////////////////////////////////////////////////////////////////
 ********************** - UPLOAD PROFILE IMAGE - **********************
 */ ////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.resolve(__dirname, "./uploads"));
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});

const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 4197152,
    },
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    let imageUrl = s3Url + req.file.filename;
    // console.log("url ==> ", imageUrl);

    if (imageUrl) {
        db.addImage(imageUrl, req.session.userId)
            .then((result) => {
                // console.log(result.rows[0]);
                res.json({
                    success: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error is /upload", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

/*////////////////////////////////////////////////////////////////////
 *************************** - UPDATE BIO- ***************************
 */ //////////////////////////////////////////////////////////////////
app.post("/upload/profile/bio", function (req, res) {
    if (req.body.bio) {
        db.updateBio(req.body.bio, req.session.userId)
            .then((result) => {
                console.log("profile bio result", result.rows[0]);
                res.json({ success: true, payload: result.rows[0] });
            })
            .catch((err) => {
                console.log("err", err);
            });
    } else {
        console.log("error in updting user's bio ");
        res.json({
            success: false,
            error: true,
        });
    }
});

/*////////////////////////////////////////////////////////////////////
 *************************** - FRIENDSHIP - ***************************
 */ //////////////////////////////////////////////////////////////////
app.get("/friendship/:id", (req, res) => {
    // console.log("friend", req.params.id);
    db.checkFriendship(req.session.userId, req.params.id)
        .then((results) => {
            // console.log("at friendship", results.rows);
            if (results.rows[0]) {
                res.json(results.rows[0]);
            } else {
                res.json({ friendship: false });
            }
        })
        .catch((err) => {
            console.log("there is something wrong at checking friendship", err);
        });
});

app.post("/friendship/:id/:action", (req, res) => {
    if (req.params.action === "add") {
        // console.log("adding friends");
        db.addFriendship(req.session.userId, req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err at adding friendship", err);
            });
    } else if (req.params.action === "end" || req.params.action === "cancel") {
        db.deleteFriendship(req.session.userId, req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err at canceling friendship", err);
            });
    } else {
        db.acceptFriendship(req.session.userId, req.params.id)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err at accepting friendship", err);
            });
    }
});

app.get("/friends-wannabees", (req, res) => {
    db.getAllFriendships(req.session.userId)
        .then((result) => {
            res.json({ success: true, payload: result.rows });
        })
        .catch((err) => {
            console.log("err at friends-wannabees", err);
        });
});

app.post("/accept-friend/:id", (req, res) => {
    db.acceptFriendship(req.session.userId, req.params.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(
                "there is something wrong at accepting friendship",
                err
            );
        });
});

app.post("/unfriend/:id", (req, res) => {
    db.deleteFriendship(req.session.userId, req.params.id)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => {
            console.log(
                "there is something wrong at canceling friendship",
                err
            );
        });
});

/*
 ********************** - logout - **********************
 */
app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ success: true });
    // res.redirect("/login");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

/*///////////////////////////////////////////////////////
 ********************** - Listen - **********************
 */ //////////////////////////////////////////////////////
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
//server side runns on 3001 and client side on 3000 => ideally we never use 3001

// BELOW IS ALL THE CODE FOR MY SOCKETS COMMUNICATION
io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    console.log(
        `User with id: ${userId} and socket.id ${socket.id}, just connected`
    );

    //in here we do our emitting on every new connection! Like when the user first
    // connect we want to sent them the chat history
    // 1. get the messages from the database
    db.getAllMessages()
        .then((result) => {
            // console.log("result", result);
            // console.log("result.rows", result.rows);

            const messages = result.rows;
            socket.emit("last-10-messages", {
                messages: messages,
            });
        })
        .catch((err) => {
            console.log("err => get all messages", err);
        });

    // 2. send them over to the socket that just connected

    socket.on("new-message", (newMsg) => {
        // console.log("new-message:", newMsg);
        // 1. we want to know who send the message
        // console.log("author of the msg was user with id:", userId);
        // 2. we need to add this msg to the chats table
        db.addNewMessage(newMsg, userId).then((result) => {
            // console.log("result from addNewMsg", result);
            const newMsg = result.rows[0];

            db.getUser(userId)
                .then((result) => {
                    // console.log("result from addNewMsg:user", result);
                    const newUser = result.rows[0];
                    const comMessage = {
                        id: newMsg.id,
                        first: newUser.first,
                        last: newUser.last,
                        imageurl: newUser.imageurl,
                        message: newMsg.message,
                        user_id: newMsg.user_id,
                    };
                    io.emit("add-new-message", comMessage);
                })
                .catch((err) => {
                    console.log("err => get new message", err);
                });
        });

        // 3. we want to retrieve user information about the author
        // 4. compose a message object that contains user info, and message
        // 5. send back to all connect sockets, that there is a new msg to add
        // sendet life an alle weiter

        //neue query, testen ob letzte nachrichten noch da sind
        //
    });
});
