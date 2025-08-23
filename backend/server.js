const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();
const port = 5000;

// Connect to MongoDB
const dbURI = 'mongodb://localhost:27017/ai_coach_db'; // Replace with your MongoDB URI
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors());

const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import the User model

// API to get interview questions
app.get('/api/interview/questions', (req, res) => {
  const questions = require('./data/questions.json');
  res.status(200).json(questions);
});

// User Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Create a new user instance
    user = new User({
      name,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// User Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the db
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // If credentials are valid, send a success response
    res.status(200).json({ msg: 'Logged in successfully', user: { name: user.name, email: user.email } });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});