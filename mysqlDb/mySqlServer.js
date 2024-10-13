const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./mySqlDb");

const app = express();
app.use(cors());
const port = 5000;
const saltRounds = 10;

app.use(express.json());

// User registration
app.post("/registration", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, results) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "User registered successfully",
        user: { id: results.insertId, name, email },
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const user = results[0];
    if (!user) {
      res.json({ error: "User not Found" });
      return;
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (isPassword) {
      res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  });
});

// Get all users
app.get("/getAllUsers", (req, res) => {
  const sql = "SELECT * FROM user";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ user: results });
  });
});

// Create new post
app.post("/post", (req, res) => {
  const { author, postBody, postTitle, postDate, category } = req.body;
  const sql =
    "INSERT INTO post (author, postBody, postTitle, postDate, category) VALUES (?, ?, ?, ?, ?)";
  const params = [author, postBody, postTitle, postDate, category];
  db.query(sql, params, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "New Post Created Successfully",
      post: {
        id: results.insertId,
        author,
        postBody,
        postTitle,
        postDate,
        category,
      },
    });
  });
});

// Get all posts
app.get("/getAllPost", (req, res) => {
  const sql = "SELECT * FROM post";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ post: results });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
