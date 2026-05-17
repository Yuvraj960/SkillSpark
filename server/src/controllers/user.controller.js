const User = require('../models/User');

// @desc    Get user profile (public - for viewing sparkies)
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['name', 'aboutMe', 'phone', 'avatarUrl', 'githubUrl', 'portfolioUrl', 'contactEmail', 'interests'];
    const updates = {};
    
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete sparky onboarding
// @route   PUT /api/users/onboarding
// @access  Private (sparky only)
const completeOnboarding = async (req, res) => {
  try {
    const { aboutMe, contactEmail, phone, avatarUrl, githubUrl, portfolioUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { aboutMe, contactEmail, phone, avatarUrl, githubUrl, portfolioUrl, isOnboarded: true },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Onboarding completed', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a skill (sparky only)
// @route   POST /api/users/skills
// @access  Private (sparky only)
const addSkill = async (req, res) => {
  try {
    const { name, description, category, sessionLength, creditsPerSession, isRemote, isGroup } = req.body;

    if (!name || !description || !category || !sessionLength || !creditsPerSession) {
      return res.status(400).json({ success: false, message: 'Please provide all required skill fields' });
    }

    const user = await User.findById(req.user.id);
    user.skills.push({ name, description, category, sessionLength, creditsPerSession, isRemote, isGroup });
    await user.save();

    res.status(201).json({ success: true, message: 'Skill added successfully', skills: user.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/users/skills/:skillId
// @access  Private (sparky only)
const updateSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const skill = user.skills.id(req.params.skillId);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });

    Object.assign(skill, req.body);
    await user.save();

    res.json({ success: true, message: 'Skill updated', skills: user.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/users/skills/:skillId
// @access  Private (sparky only)
const deleteSkill = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.skills = user.skills.filter((s) => s._id.toString() !== req.params.skillId);
    await user.save();
    res.json({ success: true, message: 'Skill removed', skills: user.skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all sparkies (for booking)
// @route   GET /api/users/sparkies
// @access  Private
const getSparkies = async (req, res) => {
  try {
    const { search, category, minRating } = req.query;
    const query = { type: 'sparky', isOnboarded: true, isActive: true };

    let sparkies = await User.find(query).select('-password -email');

    // Filter by search
    if (search) {
      const s = search.toLowerCase();
      sparkies = sparkies.filter(
        (sp) =>
          sp.name.toLowerCase().includes(s) ||
          sp.skills.some((sk) => sk.name.toLowerCase().includes(s) || sk.category.toLowerCase().includes(s))
      );
    }

    // Filter by category
    if (category && category !== 'all') {
      sparkies = sparkies.filter((sp) =>
        sp.skills.some((sk) => sk.category === category)
      );
    }

    // Filter by rating
    if (minRating) {
      sparkies = sparkies.filter((sp) => sp.overallRating >= parseFloat(minRating));
    }

    res.json({ success: true, count: sparkies.length, sparkies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add credits (purchase)
// @route   POST /api/users/credits/add
// @access  Private
const addCredits = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 10) {
      return res.status(400).json({ success: false, message: 'Minimum credit purchase is 10' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: amount } },
      { new: true }
    ).select('-password');

    res.json({ success: true, message: `${amount} credits added to your account`, credits: user.credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sparky dashboard stats
// @route   GET /api/users/dashboard/sparky
// @access  Private (sparky only)
const getSparkyDashboard = async (req, res) => {
  try {
    const Session = require('../models/Session');
    const Project = require('../models/Project');

    const user = await User.findById(req.user.id).select('-password');
    const upcomingSessions = await Session.find({ sparkyId: req.user.id, status: 'upcoming' }).sort({ scheduledAt: 1 }).limit(5);
    const recentSessions = await Session.find({ sparkyId: req.user.id, status: 'completed' }).sort({ updatedAt: -1 }).limit(3);
    const activeBids = await Project.find({ 'bids.sparkyId': req.user.id, status: 'open' });

    res.json({
      success: true,
      dashboard: {
        credits: user.credits,
        totalEarnings: user.totalEarnings,
        sessionsCompleted: user.sessionsCompleted,
        overallRating: user.overallRating,
        totalReviews: user.totalReviews,
        skillsCount: user.skills.length,
        upcomingSessions,
        recentSessions,
        activeBidsCount: activeBids.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  completeOnboarding,
  addSkill,
  updateSkill,
  deleteSkill,
  getSparkies,
  addCredits,
  getSparkyDashboard,
};
