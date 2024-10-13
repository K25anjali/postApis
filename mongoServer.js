const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

// MongoDB connection
mongoose
  .connect("url")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const postSchema = new mongoose.Schema({
  author: String,
  postBody: String,
  postTitle: String,
  postDate: { type: Date, default: Date.now },
  category: String,
});

// Models
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;
const saltRounds = 10;

// User registration
app.post("/registration", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({
      message: "User registered successfully",
      user: { id: user._id, name, email },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }); // Corrected from findone to findOne
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password); // Corrected from User.password to user.password
    if (isPassword) {
      res.json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Get all users
app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(400).json({ error: "Error fetching users" });
  }
});

// Create new post
app.post("/post", async (req, res) => {
  const { author, postBody, postTitle, category } = req.body;

  try {
    const post = new Post({ author, postBody, postTitle, category });
    await post.save();
    res.json({
      message: "New Post Created Successfully",
      post: { id: post._id, author, postBody, postTitle, category },
    });
  } catch (error) {
    res.status(400).json({ error: "Error creating post" });
  }
});

// Get all posts
app.get("/getAllPost", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts }); // Corrected to send posts directly
  } catch (error) {
    res.status(400).json({ error: "Error fetching posts" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
