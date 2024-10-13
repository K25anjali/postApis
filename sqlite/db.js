let sqlite3 = require("sqlite3").verbose();

//create user table
const createuserTable = `CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text, 
  email text UNIQUE, 
  password text, 
  CONSTRAINT email_unique UNIQUE (email)
  )`;

// Create post table
const createPostTable = `
CREATE TABLE IF NOT EXISTS post (
id INTEGER PRIMARY KEY AUTOINCREMENT,
author TEXT NOT NULL,
postBody TEXT NOT NULL,
postTitle TEXT NOT NULL,
postDate TEXT NOT NULL,
category TEXT NOT NULL
);
`;

let db = new sqlite3.Database("db.sqlite", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(createuserTable, (err) => {
      if (err) {
        console.error("Error creating user table:", err.message);
      } else {
        console.log("USER created successfully.");
      }
    });

    db.run(createPostTable, (err) => {
      if (err) {
        console.error("Error creating posts table:", err.message);
      } else {
        console.log("POST created successfully.");
      }
    });
  }
});

module.exports = db;
