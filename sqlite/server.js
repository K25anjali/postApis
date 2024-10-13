const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
const port = 5000;
const saltRounds = 10;

app.use(express.json());

//user registration
app.post("/registration", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    let sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
    let params = [name, email, hashedPassword];

    db.run(sql, params, (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "User registered successfully",
        user: { id: this.lastID, name, email },
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

//user login
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  let sql = "SELECT * FROM user WHERE email =?";

  db.get(sql, [email], async (err, user) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
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

//get all users
app.get("/getAllUsers", (req, res) => {
  let sql = "select * from user";
  db.all(sql, (err, user) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      user: user,
    });
  });
});

//create new post
app.post("/post", (req, res) => {
  const { author, postBody, postTitle, postDate, category } = req.body;
  let sql =
    "INSERT INTO post (author,postBody,postTitle,postDate,category) VALUES(?,?,?,?,?)";
  const params = [author, postBody, postTitle, postDate, category];
  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else {
      res.json({
        message: "new Post Created Successfully",
        post: {
          id: this.lastID,
          author: author,
          postBody: postBody,
          postTitle: postTitle,
          postDate: postDate,
          category: category,
        },
      });
    }
  });
});

//get all post
app.get("/getAllPost", (req, res) => {
  let sql = "SELECT * FROM post";
  db.all(sql, (err, post) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else {
      res.json({
        post: post,
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
