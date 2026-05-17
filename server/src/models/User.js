const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skillEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['programming', 'design', 'marketing', 'business', 'personal', 'music', 'language', 'other'],
    required: true,
  },
  sessionLength: { type: Number, required: true }, // in minutes
  creditsPerSession: { type: Number, required: true },
  isRemote: { type: Boolean, default: true },
  isGroup: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  sessions: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // don't return password by default
  },
  type: {
    type: String,
    enum: ['sparky', 'client'],
    required: [true, 'User type is required'],
  },
  isOnboarded: { type: Boolean, default: false },
  credits: { type: Number, default: 0 },

  // Profile fields (mostly for sparkies)
  aboutMe: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  phone: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },

  // Sparky-specific
  skills: [skillEntrySchema],
  sessionsCompleted: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  overallRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  // Client-specific
  interests: [{ type: String }],
  totalSpent: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set default credits on creation
userSchema.pre('save', function (next) {
  if (this.isNew && this.credits === 0) {
    this.credits = this.type === 'client' ? 100 : 50;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
