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
  title: { type: String, default: "" },
  completedcourses: { type: Array },
  selectedcourses: { type: Array },
  theme:{type:String,default:"light-mode"}
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);


const quizDB = mongoose.createConnection("mongodb+srv://dycquiz:dycquiz@quiz.zrkvrmd.mongodb.net/quizquestions", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

quizDB.on("connected", () => {
  console.log("Connected to quizquestions DB");
});

quizDB.on("error", (err) => {
  console.error("quizquestions DB connection error:", err);
});

const quizSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  quiz: { type: Array, required: true },
  results: { type: Array, default: [] } // Store results of users who took the quiz
  ,totalQuestion:{type:Number,default:0}
});
const QuizModel = quizDB.model("Quiz", quizSchema);
console.log("QuizModel created successfully", QuizModel);
// Sample quiz data





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
    res.json({
      completedcourses: user.completedcourses,
      title: user.title
    });
    console.log("title:", user.title);
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
    

    console.log("Question added:", newQuestion);
    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  }).catch(err => {
    console.error("Error saving question:", err);
    res.status(500).json({ message: "Error saving question" });
  });
});



app.post('/remove_item', authenticateToken, async (req, res) => {
  console.log("Ulla vanthuttean");

  const index = req.body.cid; // index of the course to be removed
  console.log("Index to remove:", index);

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (index < 0 || index >= user.completedcourses.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    user.completedcourses.splice(index, 1); // removes 1 item at the specified index
    await user.save();

    console.log("Updated completedcourses:", user.completedcourses);
    res.status(200).json({ message: "Item removed successfully" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post('/edit_item', authenticateToken, async (req, res) => {
  console.log("Edit ku ulla vanthuttean da");

  const { itemId, updateValue, title1 } = req.body;
  console.log("Item ID:", itemId);
  console.log("Update Value:", updateValue);
  console.log("Title:", title1);

  if (itemId==undefined || itemId==null || !updateValue || !title1) {
    return res.status(400).json({ message: "Missing itemId or updateValue" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("before update:", user.completedcourses[itemId]);
    user.completedcourses[itemId] = updateValue;
    
    await user.save();
    console.log("after update:", user.completedcourses[itemId]);

    return res.status(200).json({ message: "Item updated successfully" });

  } catch (err) {
    console.error("Error updating item:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post('/update-title', authenticateToken, async (req, res) => {
  const { title } = req.body; 
  console.log("Update title ku ulla vanthuttean da");
  console.log("Title:", title);
  if (!title) { 
    return res.status(400).json({ message: "Title is required" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    user.title = title; // Update the title in the user document
    await user.save();
    console.log("Title updated successfully:", user.title);
    res.status(200).json({ message: "Title updated successfully", title: user.title });
  } catch (error) {
    console.error("Error updating title:", error);
    res.status(500).json({ message: "Error updating title" });
  }
});

const generateRandomCode = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  while (true) {
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingCode = await QuizModel.findOne({ code });
    if (!existingCode) {
      return code;
    }
    // else loop continues to generate new one
  }
};

app.post('/export', authenticateToken, async (req, res) => {
  try {
    const { questions, testName,totalQuestions } = req.body;
    console.log("Request Body:", req.body);
    console.log("Total Check",totalQuestions)
    const code = await generateRandomCode();
    console.log("Generated code:", code);

    if (!testName || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    if (!req.user?.username) {
      return res.status(403).json({ message: "User not authenticated properly" });
    }
    const sampleQuiz = new QuizModel({
      totalQuestion:totalQuestions,
      code,
      name: testName,
      author: req.user.username,
      quiz: questions,
    });
    console.log("SAMPLE DATA",sampleQuiz)

    await sampleQuiz.save();
    console.log("Sample quiz inserted successfully");

    res.status(201).json({ message: "Quiz created", code });
  } catch (err) {
    console.error("Error inserting sample quiz:", err.message);
    res.status(500).json({ message: "Failed to export quiz" });
  }
});

app.post('/delete-quiz', authenticateToken, async (req, res) => {

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    user.completedcourses = [];
    user.title = ""; // Reset the title to an empty string
    await user.save();
  }catch (err) {
    console.error("Error deleting quiz:", err.message);
    return res.status(500).json({ message: "Failed to delete quiz" });
  }
}); 
app.get('/get-code', authenticateToken, async (req, res) => {
  try {
    // Fetch the latest quiz created by the logged-in user (or customize as needed)
    const quiz = await QuizModel.findOne({ author: req.user.username }).sort({ _id: -1 });

    if (!quiz) {
      return res.status(404).json({ message: "No quiz found for this user" });
    }

    res.status(200).json({ code: quiz.code });
  } catch (err) {
    console.error("Error fetching code:", err.message);
    res.status(500).json({ message: "Failed to get quiz code" });
  }
});



app.get('/getInfo', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ firstname: user.firstname });
  } catch (err) {
    console.error("Error fetching user info:", err.message);
    res.status(500).json({ message: "Failed to get user info" });
  }
}
);



app.get('/getTests', authenticateToken, async (req, res) => {
  try {
    const tests = await QuizModel.find({ author: req.user.username });
    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: "No tests found for this user" });
    }
    res.status(200).json({ tests });
  } catch (err) {
    console.error("Error fetching tests:", err.message);
    res.status(500).json({ message: "Failed to fetch tests" });
  }
});


app.get('/import/:code', authenticateToken, async (req, res) => {
  const { code } = req.params;
  try {
    const quiz = await QuizModel.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    
    res.status(200).json({ quiz: quiz.quiz, quizName: quiz.name }); // only send quiz array
    console.log("Quiz imported successfully:", quiz.name);
  } catch (err) {
    res.status(500).json({ message: "Failed to import quiz" });
  }
});


app.post('/submit-quiz', authenticateToken, async (req, res) => {
  const { code, score, percentage } = req.body;
  console.log("Code:", code);
  console.log("Score:", score);
  console.log("Percentage:", percentage);

  try {
    const quiz = await QuizModel.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const users = await User.findOne({ username: req.user.username });
    console.log("User:", users);
    if (!users) return res.status(401).json({ message: "Unauthorized" });

    // Check if the user already submitted the quiz
    const existingResultIndex = quiz.results.findIndex(
      (result) => result.username === req.user.username
    );

    const updatedResult = {
      name: users.firstname + " " + users.lastname,
      username: req.user.username,
      score,
      percentage,
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    };

    if (existingResultIndex !== -1) {
      // Update the existing result
      quiz.results[existingResultIndex] = updatedResult;
    } else {
      // Add new result
      quiz.results.push(updatedResult);
    }

    await quiz.save();

    res.status(200).json({ message: "Quiz submitted successfully", score, percentage });
  } catch (err) {
    console.error("Error submitting quiz:", err.message);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
});

app.get('/report', authenticateToken, async (req, res) => {
  const { code } = req.query; // code of the quiz to fetch reports for
  try {
   console.log(code)
    const quiz = await QuizModel.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });  
    res.status(200).json({ results: quiz.results,name:quiz.name,totalQuestion:quiz.totalQuestion });
    console.log("Report fetched successfully for code:", code);
    console.log(quiz)
  } catch (err) {
    console.log("Error")
  }
});
// Start the server
module.exports = app;
