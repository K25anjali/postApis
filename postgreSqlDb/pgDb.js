const { pool } = require("pg");

const pool = new pool({
  user: "",
  host: "",
  database: "",
  host: "",
  password: "",
  port: "",
});

// Create user table
const createUserTable = `
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);`;

// Create post table
const createPostTable = `
CREATE TABLE IF NOT EXISTS post (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  postBody TEXT NOT NULL,
  postTitle VARCHAR(255) NOT NULL,
  postDate DATETIME NOT NULL,
  category VARCHAR(255) NOT NULL
);`;

pool.query(createUserTable, (err) => {
  if (err) return console.log("Error creating user table:", err.message);
  console.log("USER created successfully.");
});

pool.query(createPostTable, (err) => {
  if (err) return console.log("Error creating post table:", err.message);
  console.log("Post created successfully.");
});

exports.module = pool;
