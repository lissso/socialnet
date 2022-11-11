//below we have information that we need for out db connection
// which db do we talk to?
const database = "socialnetwork";
// which user is running our queries in the db
const username = "postgres";
// what's the users password
const password = "postgres";

const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);
console.log("[db] is connecting to ", database);

/*
 ********************** - Register - **********************
 */
module.exports.registerUser = (first, last, email, password) => {
    const q = `INSERT INTO users ( first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id`;
    const param = [first, last, email, password];
    return db.query(q, param);
};

/*
 ********************** - Login - **********************
 */
module.exports.getEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

/*
 ********************** - Reset - **********************
 */

module.exports.addCode = (email, code) => {
    const q = `INSERT INTO reset_codes(email, code)
               VALUES ($1, $2)
               RETURNING *`;
    const param = [email, code];
    return db.query(q, param);
};

module.exports.getCode = (email) => {
    const q = `SELECT reset_codes.email, reset_codes.code
               FROM reset_codes
               WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
               AND email = $1
               ORDER BY id DESC
               LIMIT 1;`;
    const param = [email];
    return db.query(q, param);
};

module.exports.updatePassword = (password, email) => {
    const q = `UPDATE users 
               SET password = $1
               WHERE email = $2`;
    const param = [password, email];
    return db.query(q, param);
};

module.exports.updateBio = (bio, userId) => {
    const q = `UPDATE users 
               SET bio = $1
               WHERE id = $2
               RETURNING bio`;
    const param = [bio, userId];
    return db.query(q, param);
};

/*
 ********************** - User - **********************
 */
module.exports.getUser = (id) => {
    return db.query(
        `SELECT users.first, users.last, users.imageUrl, users.bio 
        FROM users
        WHERE id = $1`,
        [id]
    );
};

/*
 ********************** - add IMAGE - **********************
 */
module.exports.addImage = (imageUrl, userId) => {
    const q = `UPDATE users
               SET imageUrl = $1 
               WHERE id = $2
               RETURNING imageUrl`;

    const param = [imageUrl, userId];
    return db.query(q, param);
};

/*
 ********************** - Find Users - **********************
 */

module.exports.getRecentUsers = (id) => {
    return db.query(
        `SELECT first, last, imageUrl, bio, email, id
                        FROM users
                        WHERE id <> $1
                        ORDER BY id DESC
                        LIMIT 4
                        ;`,
        [id]
    );
};

module.exports.getMatchingUsers = (val) => {
    const q = `SELECT users.id, users.first, users.last, users.imageUrl 
                FROM users 
                WHERE first ILIKE $1
                OR last ILIKE $1
                LIMIT 4;`;
    const param = [val + "%"];
    return db.query(q, param);
};

/*
 ********************** - Friendships - **********************
 */

module.exports.checkFriendship = (id, otherId) => {
    return db.query(
        `SELECT * FROM friendships 
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1);`,
        [id, otherId]
    );
};

module.exports.addFriendship = (id, otherId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ( $1, $2);
        `,
        [id, otherId]
    );
};

module.exports.acceptFriendship = (id, otherId) => {
    return db.query(
        `UPDATE friendships
    SET accepted = true
    WHERE (recipient_id = $1 AND sender_id = $2) 
    ;`,
        [id, otherId]
    );
};

module.exports.deleteFriendship = (id, otherId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1);`,
        [id, otherId]
    );
};

module.exports.getAllFriendships = (id) => {
    return db.query(
        `
        SELECT users.id, first, last, imageUrl, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [id]
    );
};

module.exports.getAllMessages = () => {
    return db.query(`
                    SELECT  messages.message, messages.created_at, users.first, users.last, users.imageUrl
                    FROM messages
                    LEFT OUTER JOIN users
                    ON messages.user_id = users.id
                    ORDER BY created_at DESC 
                    LIMIT 10;`);
};

module.exports.addNewMessage = (newMsg, userId) => {
    const q = `INSERT INTO messages(message, user_id) 
                VALUES ($1, $2) 
                RETURNING *`;
    const param = [newMsg, userId];
    return db.query(q, param);
};
