const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gitHub: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['sparky', 'client'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
