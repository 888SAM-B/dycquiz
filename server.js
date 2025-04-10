const express = require('express');
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors());

// Sample data
let pythontest = [
  {
    "question": "Which of the following is the correct way to create a variable in Python?",
    "options": [
      "variable = 10",
      "int variable = 10",
      "var = 10;",
      "variable : 10"
    ],
    "answer": 0
  },
];

// GET: Return all questions
app.get('/python', (req, res) => {
  res.json(pythontest);
});

// POST: Add a new question
app.post('/python', (req, res) => {
  const { question, options, answer } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  // Create a new question object
  const newQuestion = {
    question,
    options: options || [],   // default to empty array if not provided
    answer: answer || 0       // default answer index is 0
  };

  // Add to the list
  pythontest.push(newQuestion);
  console.log("Question added:", newQuestion);

  res.status(201).json({ message: "Question added successfully", question: newQuestion });
});

// Start the server
app.listen(3002, () => console.log('API running on http://localhost:3002'));
