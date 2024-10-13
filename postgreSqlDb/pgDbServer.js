const express = require("express");
const bcrypt = require("bcrypt");
const cors = require(cors);
const pool = require("./pgDb");

const app = express();
app.use(express.cors());
const port = 4000;
const saltRounds = 10;

// User registration
app.post("/registration", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = "INSERT INTO user (name, email, password) VALUES ($1,$2 ,$3)";
    pool.query(sql, [name, email, hashedPassword], (err, results) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      const userId = results.rows[0].id;
      res.json({
        message: "User registered successfully",
        user: { id: userId, name, email },
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM user WHERE email = $1";

  pool.query(sql, [email], async (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    const user = results.rows[0];
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
  pool.query(sql, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ users: results.rows });
  });
});

// Create new post
app.post("/post", (req, res) => {
  const { author, postBody, postTitle, postDate, category } = req.body;
  const sql =
    "INSERT INTO post (author, postBody, postTitle, postDate, category) VALUES ($1, $2, $3, $4, $5) RETURNING id";
  const params = [author, postBody, postTitle, postDate, category];
  pool.query(sql, params, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    const userId = results.rows[0].id;

    res.json({
      message: "New Post Created Successfully",
      post: {
        id: userId,
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
  pool.query(sql, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ posts: results.rows });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
