const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { use } = require('passport');
const router = express.Router();
require('dotenv').config();



// Middleware
app.use(express.json());
app.use(cors());
app.use('/python', router);


// Connect to MongoDB
mongoose.connect("mongodb+srv://dycquiz:dycquiz@quiz.zrkvrmd.mongodb.net/quiz", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// User Schema
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  completedcourses: { type: Array },
  selectedcourses: { type: Array },
  theme:{type:String,default:"light-mode"}
});


// Sample test
let pythontest = [
      {
      "question": "What does `mylist[::-1]` do?",
      "options": [
        "Returns a reversed copy of the list",
        "Reverses the list in place",
        "Sorts the list in descending order",
        "Returns every other element of the list"
      ],
      "answer": 0
      },
      {
      "question": "Which of the following is true about Python's GIL (Global Interpreter Lock)?",
      "options": [
        "It allows multiple threads to execute Python bytecode simultaneously",
        "It prevents multiple threads from executing Python bytecode simultaneously",
        "It optimizes memory usage in multiprocessing applications",
        "It is a lock used in Python's garbage collection"
      ],
      "answer": 1
      }
    ];

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

  jwt.verify(token, 'cbt', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('Server is running successfully!');
  console.log('Server is running successfully!');
});

// Registration Route
app.post("/register", async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  if (!firstname || !lastname || !username || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = new User({ firstname, lastname, username, password });
    newUser.completedcourses = [...pythontest];
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Update Theme Route
app.post('/update-theme', authenticateToken, async (req, res) => {
  const { theme } = req.body;
  console.log("Update theme ku Ulla Vanthuttean");
  if (!theme) {
    return res.status(400).json({ message: "Theme is required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.theme = theme;
    await user.save();

    res.status(200).json({ message: "Theme updated successfully", theme: user.theme });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).json({ message: "Error updating theme" });
  }
});


// Get Theme Route
app.get('/get-theme', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ theme: user.theme });
  } catch (error) {
    console.error("Error fetching theme:", error);
    res.status(500).json({ message: "Error fetching theme" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, 'cbt', { expiresIn: '1h' });
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// GET: Return user's questions
app.get('/python', authenticateToken, (req, res) => {
  User.findById(req.user.id).then(user => {
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(user.completedcourses);
  }).catch(err => {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Error fetching questions" });
  });
});

// POST: Add new question to user's completedcourses
app.post('/python', authenticateToken, (req, res) => {
  const { question, options, answer } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  const newQuestion = {
    question,
    options: options || [],
    answer: parseInt(answer) || 0
  };

  User.findById(req.user.id).then(user => {
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.completedcourses.push(newQuestion);
    user.save();
    pythontest.push(newQuestion);

    console.log("Question added:", newQuestion);
    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  }).catch(err => {
    console.error("Error saving question:", err);
    res.status(500).json({ message: "Error saving question" });
  });
});



app.get('/remove_item', authenticateToken, async (req, res) => {
  console.log("Ulla vanthuttean");

  const id = req.query.id; // Use query param, not body
  console.log("ID:", id);

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove the course with id from completedcourses
    console.log(user.completedcourses[id])
    user.completedcourses.pop(id); // Assuming id is the index of the course to remove
    await user.save();
    console.log(user.completedcourses);
    res.status(200).json({ message: "Item removed successfully" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Start the server
app.listen(3002, () => console.log('API running on http://localhost:3002'));
