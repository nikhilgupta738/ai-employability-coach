require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;

// Connect to MongoDB
const dbURI = "mongodb://localhost:27017/ai_coach_db";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware: All 'app.use' calls should go at the top
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- API Routes ---

// User Registration Route
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User with this email already exists" });
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// User Login Route
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    res
      .status(200)
      .json({
        msg: "Logged in successfully",
        user: { name: user.name, email: user.email },
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// API to get interview questions
app.get("/api/interview/questions", (req, res) => {
  const questions = require("./data/questions.json");
  res.status(200).json(questions);
});

// New route to get AI feedback
app.post("/api/interview/feedback", async (req, res) => {
  const { question, userAnswer } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use the appropriate model name
    const prompt = `You are an AI career coach. Provide constructive feedback on the following interview answer. Focus on clarity, content, and potential improvements. Keep your feedback concise, limited to a single paragraph and no more than 3-4 key points.
    Question: "${question}"
    User's Answer: "${userAnswer}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    res.status(500).json({ msg: "Failed to get feedback from AI." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
