const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get profile
router.get('/profile/:id', getProfile);

// Update profile
router.put('/profile/:id', updateProfile);

module.exports = router;