const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Register new user
exports.register = async (req, res) => {
  try {
    const { userType, ...userData } = req.body;
    
    // Check if username exists
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = new User({
      ...userData,
      userType,
      skills: userType === 'sparky' ? userData.skills.split(',').map(skill => skill.trim()) : []
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, userType }, config.jwtSecret, {
      expiresIn: '7d'
    });

    res.status(201).json({ token, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, userType: user.userType }, config.jwtSecret, {
      expiresIn: '7d'
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = key === 'skills' 
          ? updateData[key].split(',').map(skill => skill.trim())
          : updateData[key];
      }
    });

    // Update password if provided
    if (password) {
      user.password = password;
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};