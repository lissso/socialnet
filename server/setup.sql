DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       first VARCHAR NOT NULL CHECK (first != ''),
       last VARCHAR NOT NULL CHECK (last != ''),
       email VARCHAR NOT NULL UNIQUE CHECK (email != ''),
       imageUrl TEXT,
       password VARCHAR NOT NULL CHECK (password != ''),
       bio TEXT
);


CREATE TABLE reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    code VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
  );

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (user_id, message)
 VALUES (68, 'Hallo lisa');