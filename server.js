const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

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
});

// Sample test
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
  {
    "question": "Which of the following data types is immutable in Python?",
    "options": [
      "List",
      "Dictionary",
      "Set",
      "String"
    ],
    "answer": 3
  },
  {
    "question": "What will be the result of the expression 10 % 3?",
    "options": [
      "1",
      "3",
      "0",
      "10"
    ],
    "answer": 0
  },
  {
    "question": "Which of the following is used to define a function in Python?",
    "options": [
      "func",
      "def",
      "function",
      "define"
    ],
    "answer": 1
  },
  {
    "question": "What is the output of print(2 ** 3)?",
    "options": [
      "6",
      "8",
      "9",
      "3"
    ],
    "answer": 1
  },
  {
    "question": "How can you create a list with elements 'a', 'b', and 'c' in Python?",
    "options": [
      "list = ('a', 'b', 'c')",
      "list = ['a', 'b', 'c']",
      "list = a, b, c",
      "list = <'a', 'b', 'c'>"
    ],
    "answer": 1
  },
  {
    "question": "What does the len() function return when applied to a list?",
    "options": [
      "The first element",
      "The last element",
      "The number of elements in the list",
      "The sum of elements in the list"
    ],
    "answer": 2
  },
  {
    "question": "Which of the following will raise an exception in Python?",
    "options": [
      "x = 10 / 2",
      "y = 10 / 0",
      "z = 10 + 2",
      "w = 'Hello' + ' World'"
    ],
    "answer": 1
  },
  {
    "question": "How do you define a dictionary in Python?",
    "options": [
      "dict = (1: 'apple', 2: 'banana')",
      "dict = {1: 'apple', 2: 'banana'}",
      "dict = [1: 'apple', 2: 'banana']",
      "dict = 'apple', 'banana'"
    ],
    "answer": 1
  },
  {
    "question": "Which of the following is used to handle exceptions in Python?",
    "options": [
      "try-except",
      "catch-finally",
      "throw-catch",
      "exception-try"
    ],
    "answer": 0
  },
  {
    "question": "Which method would you use to remove an item from a list in Python?",
    "options": [
      "list.delete()",
      "list.pop()",
      "list.remove()",
      "list.removeAt()"
    ],
    "answer": 2
  },
  {
    "question": "What is the correct syntax to check if a number is even in Python?",
    "options": [
      "if number % 2 == 0:",
      "if number // 2 == 0:",
      "if number == 2:",
      "if number / 2 == 0:"
    ],
    "answer": 0
  },
  {
    "question": "What is the output of the following code: print(bool(0))?",
    "options": [
      "True",
      "False",
      "None",
      "Error"
    ],
    "answer": 1
  },
  {
    "question": "Which of the following is not a valid way to create a set in Python?",
    "options": [
      "set1 = {1, 2, 3}",
      "set2 = set([1, 2, 3])",
      "set3 = set(1, 2, 3)",
      "set4 = set()"
    ],
    "answer": 2
  },
  {
    "question": "What is the output of: print(0.1 + 0.2 == 0.3)?",
    "options": ["True", "False", "Error", "None"],
    "answer": 1
  },
  {
    "question": "What does this print? print('5' * 2)",
    "options": ["10", "55", "'10'", "'55'"],
    "answer": 3
  },
  {
    "question": "What will be the output of: print(bool('False'))?",
    "options": ["True", "False", "None", "Error"],
    "answer": 0
  },
  {
    "question": "What is the output of: print([] == False)?",
    "options": ["True", "False", "Error", "None"],
    "answer": 1
  },
  {
    "question": "What is the result of: print('2' + 2)?",
    "options": ["'22'", "4", "TypeError", "'4'"],
    "answer": 2
  },
  {
    "question": "What does: print(10/0) result in?",
    "options": ["0", "Infinity", "ZeroDivisionError", "None"],
    "answer": 2
  },
  {
    "question": "What is the output? print(None == 0)",
    "options": ["True", "False", "None", "Error"],
    "answer": 1
  },
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
  {
    "question": "Which of the following data types is immutable in Python?",
    "options": [
      "List",
      "Dictionary",
      "Set",
      "String"
    ],
    "answer": 3
  },
  {
    "question": "What will be the result of the expression 10 % 3?",
    "options": [
      "1",
      "3",
      "0",
      "10"
    ],
    "answer": 0
  },
  {
    "question": "Which of the following is used to define a function in Python?",
    "options": [
      "func",
      "def",
      "function",
      "define"
    ],
    "answer": 1
  },
  {
    "question": "What is the output of print(2 ** 3)?",
    "options": [
      "6",
      "8",
      "9",
      "3"
    ],
    "answer": 1
  },
  {
    "question": "How can you create a list with elements 'a', 'b', and 'c' in Python?",
    "options": [
      "list = ('a', 'b', 'c')",
      "list = ['a', 'b', 'c']",
      "list = a, b, c",
      "list = <'a', 'b', 'c'>"
    ],
    "answer": 1
  },
  {
    "question": "What does the len() function return when applied to a list?",
    "options": [
      "The first element",
      "The last element",
      "The number of elements in the list",
      "The sum of elements in the list"
    ],
    "answer": 2
  },
  {
    "question": "Which of the following will raise an exception in Python?",
    "options": [
      "x = 10 / 2",
      "y = 10 / 0",
      "z = 10 + 2",
      "w = 'Hello' + ' World'"
    ],
    "answer": 1
  },
  {
    "question": "How do you define a dictionary in Python?",
    "options": [
      "dict = (1: 'apple', 2: 'banana')",
      "dict = {1: 'apple', 2: 'banana'}",
      "dict = [1: 'apple', 2: 'banana']",
      "dict = 'apple', 'banana'"
    ],
    "answer": 1
  },
  {
    "question": "Which of the following is used to handle exceptions in Python?",
    "options": [
      "try-except",
      "catch-finally",
      "throw-catch",
      "exception-try"
    ],
    "answer": 0
  },
  {
    "question": "Which method would you use to remove an item from a list in Python?",
    "options": [
      "list.delete()",
      "list.pop()",
      "list.remove()",
      "list.removeAt()"
    ],
    "answer": 2
  },
  {
    "question": "What is the correct syntax to check if a number is even in Python?",
    "options": [
      "if number % 2 == 0:",
      "if number // 2 == 0:",
      "if number == 2:",
      "if number / 2 == 0:"
    ],
    "answer": 0
  },
  {
    "question": "What is the output of the following code: print(bool(0))?",
    "options": [
      "True",
      "False",
      "None",
      "Error"
    ],
    "answer": 1
  },
  {
    "question": "Which of the following is not a valid way to create a set in Python?",
    "options": [
      "set1 = {1, 2, 3}",
      "set2 = set([1, 2, 3])",
      "set3 = set(1, 2, 3)",
      "set4 = set()"
    ],
    "answer": 2
  },
  {
    "question": "What is the output of: print(0.1 + 0.2 == 0.3)?",
    "options": ["True", "False", "Error", "None"],
    "answer": 1
  },
  {
    "question": "What does this print? print('5' * 2)",
    "options": ["10", "55", "'10'", "'55'"],
    "answer": 3
  },
  {
    "question": "What will be the output of: print(bool('False'))?",
    "options": ["True", "False", "None", "Error"],
    "answer": 0
  },
  {
    "question": "What is the output of: print([] == False)?",
    "options": ["True", "False", "Error", "None"],
    "answer": 1
  },
  {
    "question": "What is the result of: print('2' + 2)?",
    "options": ["'22'", "4", "TypeError", "'4'"],
    "answer": 2
  },
  {
    "question": "What does: print(10/0) result in?",
    "options": ["0", "Infinity", "ZeroDivisionError", "None"],
    "answer": 2
  },
  {
    "question": "What is the output? print(None == 0)",
    "options": ["True", "False", "None", "Error"],
    "answer": 1
  },
  {
    "question": "What is the output of: print(type([]) is list)?",
    "options": ["True", "False", "Error", "None"],
    "answer": 0
  },
  {
    "question": "What is the result of: print(bool(''))?",
    "options": ["True", "False", "None", "Error"],
    "answer": 1
  },
  {
    "question": "What is the output? print([1, 2, 3] > [1, 2, 2])",
    "options": ["True", "False", "Error", "None"],
    "answer": 0
  },
  {
    "question": "What is the default value of the argument 'b' in the following function: def func(a, b=2): return a + b?",
    "options": [
      "1",
      "2",
      "None",
      "Error"
    ],
    "answer": 1
  },
  {
    "question": "What will be the output of the following code: x = [1, 2, 3]; y = x; y[0] = 100; print(x)?",
    "options": [
      "[1, 2, 3]",
      "[100, 2, 3]",
      "[1, 100, 3]",
      "Error"
    ],
    "answer": 1
  },
  {
    "question": "Which of the following statements is used to exit a loop in Python?",
    "options": [
      "break",
      "exit",
      "stop",
      "quit"
    ],
    "answer": 0
  },
  {
    "question": "What will be the output of print(type([])) in Python?",
    "options": [
      "<class 'list'>",
      "<class 'tuple'>",
      "<class 'dict'>",
      "<class 'set'>"
    ],
    "answer": 0
  },
  {
    "question": "Which keyword is used to create an anonymous function in Python?",
    "options": [
      "def",
      "lambda",
      "function",
      "anonymous"
    ],
    "answer": 1
  },
  {
    "question": "What will be the output of the following code snippet?\nprint('Hello' * 3)",
    "options": [
      "'HelloHelloHello'",
      "'Hello * 3'",
      "Error",
      "'Hello  Hello  Hello'"
    ],
    "answer": 0
  },
  {
    "question": "What is the output of the following code?   print(4*5-4)",
    "options": [
      "5",
      "16",
      "20",
      "None of the above"
    ],
    "answer": 1
  },
  {
    "question": "Explain the difference between a list and a tuple in Python.",
    "options": [
      "Lists are mutable, tuples are immutable.",
      "Lists are immutable, tuples are mutable.",
      "Both are mutable.",
      "Both are immutable."
    ],
    "answer": 0
  },
  {
    "question": "What is the purpose of the `len()` function in Python?",
    "options": [
      "To calculate the length of a string",
      "To return the length of an object like a list, string, or tuple",
      "To check if a string is empty",
      "None of the above"
    ],
    "answer": 1
  },
  {
    "question": "What is a dictionary in Python? Provide an example.",
    "options": [
      "A collection of key-value pairs.",
      "A collection of ordered elements.",
      "A collection of unique items.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "How can you concatenate two strings in Python?",
    "options": [
      "Using the '+' operator.",
      "Using the '&' operator.",
      "Using the concat() method.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "What are the different data types available in Python? Name at least four.",
    "options": [
      "int, float, string, list",
      "int, double, char, string",
      "string, char, set, tuple",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "What does the following code snippet do?\nprint(10/0)",
    "options": [
      "It adds two numbers.",
      "It defines a function with a default argument.",
      "It raises an exception.",
      "None of the above"
    ],
    "answer": 1
  },
  {
    "question": "How to check if a given number is prime or not.",
    "options": [
      "The number is prime if it has no divisors other than 1 and itself.",
      "The number is prime if it is divisible by 2.",
      "The number is prime if it is divisible by 3.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "What is list comprehension?",
    "options": [
      "A concise way to create lists using a single line of code.",
      "A way to create lists using loops.",
      "A method to copy lists.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "Explain the concept of decorators in Python ",
    "options": [
      "A decorator is a function that modifies the behavior of another function.",
      "A decorator is a class that modifies the behavior of a function.",
      "A decorator is a built-in Python function.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "What are lambda functions in Python? Provide an example.",
    "options": [
      "Small anonymous functions defined with the keyword 'lambda'.",
      "Functions that are defined within another function.",
      "Functions with no parameters.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "What is the purpose of the `self` keyword in Python classes?",
    "options": [
      "To refer to the instance of the class.",
      "To define a method within a class.",
      "To call another function.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "How do you implement inheritance in Python? Write an example with a parent class and a child class.",
    "options": [
      "Using the 'extends' keyword.",
      "Using the class syntax with the parent class name in parentheses.",
      "Using the 'super' function.",
      "None of the above"
    ],
    "answer": 1
  },
  {
    "question": "What are Python's built-in data structures? Describe each briefly.",
    "options": [
      "Lists, tuples, dictionaries, sets.",
      "Lists, dictionaries, classes, functions.",
      "Strings, tuples, sets, variables.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "Explain how Python's 'with' statement is used in file handling.",
    "options": [
      "It automatically closes the file after execution.",
      "It opens files in binary mode.",
      "It creates a temporary file.",
      "None of the above"
    ],
    "answer": 0
  },
  {
    "question": "What is a module in Python?",
    "options": [
      "A file containing Python definitions and statements.",
      "A type of variable.",
      "A way to store user data.",
      "None of the above"
    ],
    "answer": 0
  }
  ,{
  "question": "What is the output of print(type(1/2)) in Python 3?",
  "options": [
    "int",
    "float",
    "bool",
    "str"
  ],
  "answer": 1
  },
  {
  "question": "Which of the following is not a valid variable name in Python?",
  "options": [
    "_var",
    "var1",
    "1var",
    "var_1"
  ],
  "answer": 2
  },
  {
  "question": "What does the following code return? bool(\"\")",
  "options": [
    "True",
    "False",
    "None",
    "Error"
  ],
  "answer": 1
  },
  {
  "question": "Which of the following is mutable?",
  "options": [
    "Tuple",
    "String",
    "List",
    "Integer"
  ],
  "answer": 2
  },
  {
  "question": "What is the output of print(\"Hello\"*2)?",
  "options": [
    "HelloHello",
    "Error",
    "Hello 2",
    "None"
  ],
  "answer": 0
  },
  {
  "question": "Which method would you use to add an element to the end of a list?",
  "options": [
    "insert()",
    "add()",
    "append()",
    "extend()"
  ],
  "answer": 2
  },
  {
  "question": "What is the result of 5 // 2 in Python?",
  "options": [
    "2.5",
    "2",
    "3",
    "Error"
  ],
  "answer": 1
  },
  {
  "question": "What does the __init__ method do in a Python class?",
  "options": [
    "Initializes an instance",
    "Deletes an instance",
    "Prints a statement",
    "Returns a value"
  ],
  "answer": 0
  },
  {
  "question": "What is the output of print(len({'a':1,'b':2}))?",
  "options": [
    "1",
    "2",
    "3",
    "Error"
  ],
  "answer": 1
  },
  {
  "question": "Which of these is not a built-in data type in Python?",
  "options": [
    "int",
    "float",
    "character",
    "list"
  ],
  "answer": 2
  },

    {
    "question": "Which statement correctly describes Python's handling of indentation?",
    "options": [
      "Indentation is optional and used for readability",
      "Indentation is required and determines code blocks",
      "Indentation is only required in loops and conditionals",
      "Indentation has no effect on code execution"
    ],
    "answer": 1
    },
    {
    "question": "What is the output of print(0 or 1)?",
    "options": [
      "0",
      "1",
      "True",
      "False"
    ],
    "answer": 1
    },
    {
    "question": "What is a more compact way to write the list comprehension [x for x in range(10) if x % 2 == 0]?",
    "options": [
      "list(range(0, 10, 2))",
      "[2x for x in range(5)]",
      "list(filter(lambda x: x % 2 == 0, range(10)))",
      "Both a and c"
    ],
    "answer": 3
    },
    {
    "question": "Which of the following is not a valid method for string objects?",
    "options": [
      "split()",
      "join()",
      "append()",
      "strip()"
    ],
    "answer": 2
    },
    {
    "question": "What is the purpose of the with statement in Python?",
    "options": [
      "Exception handling",
      "Resource management and cleanup",
      "Creating a local scope",
      "Defining a context manager"
    ],
    "answer": 1
    },
    {
    "question": "Which of the following operators has the highest precedence?",
    "options": [
      "+",
      "",
      "**",
      "()"
    ],
    "answer": 3
    },
    {
    "question": "What is the output of print([i for i in range(5)])?",
    "options": [
      "[0, 1, 2, 3, 4]",
      "[1, 2, 3, 4, 5]",
      "[0, 1, 2, 3, 4, 5]",
      "[1, 2, 3, 4]"
    ],
    "answer": 0
    },
    {
    "question": "What is the time complexity of looking up a value in a Python dictionary?",
    "options": [
      "O(n)",
      "O(log n)",
      "O(1) on average",
      "O(n²)"
    ],
    "answer": 2
    },
      {
      "question": "What does the `yield` keyword do in Python?",
      "options": [
        "Returns multiple values from a function",
        "Creates a generator function",
        "Raises an exception",
        "Terminates a loop"
      ],
      "answer": 1
      },
      {
      "question": "Which of the following is correct about module importing in Python?",
      "options": [
        "A module can be imported multiple times but is only loaded once",
        "Each import statement loads the module again",
        "Modules cannot import other modules",
        "Importing is only allowed at the beginning of a file"
      ],
      "answer": 0
      },
      {
      "question": "What is the output of \"\".join([\"a\", \"b\", \"c\"])?",
      "options": [
        "abc",
        "a b c",
        "[a, b, c]",
        "Error"
      ],
      "answer": 0
      },
      {
      "question": "What is the difference between `is` and `==` in Python?",
      "options": [
        "is compares values while == compares identities",
        "is compares identities while == compares values",
        "They are exactly the same",
        "is is for numeric comparison while == is for string comparison"
      ],
      "answer": 1
      },
      {
      "question": "What does the `*args` parameter allow in a function definition?",
      "options": [
        "Multiple keyword arguments",
        "Variable number of positional arguments",
        "Only arguments of type array",
        "Arguments with default values"
      ],
      "answer": 1
      },
      {
      "question": "Which of these statements is true about Python sets?",
      "options": [
        "Sets are ordered collections",
        "Sets allow duplicate elements",
        "Sets are mutable",
        "Sets can contain other sets"
      ],
      "answer": 2
      },
      {
      "question": "What is the output of `print(1 in [1, 2, 3])`?",
      "options": [
        "1",
        "True",
        "False",
        "Error"
      ],
      "answer": 1
      },
      {
      "question": "What does the `global` keyword do in Python?",
      "options": [
        "Declares a variable that is accessible anywhere in the program",
        "Indicates that a variable is defined in an outer scope",
        "Allows a function to modify a variable defined in the global scope",
        "Makes a function globally accessible"
      ],
      "answer": 2
      },
      {
      "question": "Which of the following is not a dunder (double underscore) method in Python?",
      "options": [
        "__init__",
        "__str__",
        "__main__",
        "__len__"
      ],
      "answer": 2
      },
      {
      "question": "What will `range(1, 10, 2)` produce?",
      "options": [
        "[1, 3, 5, 7, 9]",
        "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
        "[1, 3, 5, 7]",
        "[2, 4, 6, 8]"
      ],
      "answer": 0
      },
      {
      "question": "What does the `@staticmethod` decorator do in Python?",
      "options": [
        "Makes a method callable without an instance",
        "Makes a method thread-safe",
        "Forces static typing for the method",
        "Creates a static variable inside the method"
      ],
      "answer": 0
      },
      {
      "question": "What is the output of `print(list(filter(lambda x: x > 5, [1, 6, 3, 8, 2])))`?",
      "options": [
        "[6, 8]",
        "[1, 3, 2]",
        "[True, False, True]",
        "[6, 3, 8]"
      ],
      "answer": 0
      },
      {
      "question": "In Python, what does the `collections.defaultdict` class provide?",
      "options": [
        "A dictionary that cannot contain duplicate keys",
        "A dictionary that sorts keys automatically",
        "A dictionary that provides default values for missing keys",
        "A dictionary that can only use strings as keys"
      ],
      "answer": 2
      },
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

// Start the server
app.listen(3002, () => console.log('API running on http://localhost:3002'));
