// METHOD 1

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(cors());

// const SECRET_KEY = "secretkey";

// mongoose
//     .connect("mongodb://127.0.0.1:27017/skillspark", { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("MongoDB connected"))
//     .catch((err) => console.log(err));

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: {type: String, unique: true},
//     gitHub: String,
//     password: String
// });

// const User = mongoose.model("User", userSchema);

// app.post("/register", async (req, res) => {
//     try {
//         const { name, email, gitHub, password, confirmPassword } = req.body;

//         if (password !== confirmPassword) {
//             return res.status(400).json({ message: "Passwords do not match" });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = new User({ name, email, gitHub, password: hashedPassword });
//         await user.save();
//         res.status(201).json({ message: "User registered successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "An error occurred!", error });
//     }
// });

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, user.password);
  
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }
  
//       // Generate a JWT token
//       const token = jwt.sign({ id: user._id }, "secretkey", {
//         expiresIn: "1h",
//       });
  
//       res.status(200).json({
//         message: "Login successful",
//         token,
//         username: user.username
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
// });

// // app.get('/dashboard-data', async (req, res) => {
// //   try {
// //     const { email } = req.body;
// //     const data = await User.find({ email: email });
// //     res.status(200).json(data); 
// //   } catch (error) {
// //     console.error('Error fetching data:', error);
// //     res.status(500).json({ error: 'Failed to fetch data' });
// //   }
// // });
// app.post("/dashboard-data", async (req, res) => {
//     try {
//       const { email } = req.body;
  
//       if (!email) {
//         return res.status(400).json({ error: "Email is required" });
//       }
  
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  
//       res.status(200).json(user);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       res.status(500).json({ error: "Failed to fetch data" });
//     }
//   });
  

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT})`));


// METHOD 1

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = "secretkey";

mongoose
    .connect("mongodb://127.0.0.1:27017/skillspark", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    gitHub: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
    try {
        const { name, email, gitHub, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, gitHub, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred!", error });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, "secretkey", {
        expiresIn: "1h",
      });
  
      res.status(200).json({
        message: "Login successful",
        token,
        username: user.username
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }



    // try {
    //     const { email, password } = req.body;

    //     const user = await User.findOne({ email });
    //     if (!user) {
    //         return res.status(400).json({ message: "User not found" });
    //     }

    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) {
    //         return res.status(400).json({ message: "Invalid credentials" });
    //     }

    //     const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    //     res.status(200).json({ message: "Login successful", token });
    // } catch (error) {
    //     res.status(500).json({ message: "An error occurred", error });
    // }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


























// Method 2

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Database Connection
// mongoose
//     .connect("mongodb://localhost:27017/skillspark", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Database connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// METHOD 3

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');

// // Initialize Express
// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON payloads

// // Connect to MongoDB
// mongoose
//     .connect('mongodb://127.0.0.1:27017/skillspark', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// // User Schema
// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     gitHub: { type: String }, // New field for additional user info
//     password: { type: String, required: true },
//     role: { type: String, required: true, enum: ['client', 'sparky'] },
// });

// // User Model
// const User = mongoose.model('User', userSchema);

// // Routes
// app.post('/api/auth/register', async (req, res) => {
//     const { name, email, gitHub, password, role } = req.body;

//     // Validation checks
//     if (!name || !email || !password || !role || !gitHub) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             role,
//             gitHub
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         console.error('Error during registration:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
