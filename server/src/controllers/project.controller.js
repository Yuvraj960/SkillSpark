const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all open projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const { search, status, minBudget, maxBudget, sort } = req.query;
    const query = { isActive: true };

    if (status) query.status = status;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseInt(minBudget);
      if (maxBudget) query.budget.$lte = parseInt(maxBudget);
    }

    let projects = await Project.find(query).sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.requirements.some((r) => r.toLowerCase().includes(s))
      );
    }

    if (sort === 'budget-high') projects.sort((a, b) => b.budget - a.budget);
    if (sort === 'budget-low') projects.sort((a, b) => a.budget - b.budget);
    if (sort === 'bids') projects.sort((a, b) => b.bids.length - a.bids.length);

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (client only)
const createProject = async (req, res) => {
  try {
    const { title, description, requirements, budget, deadline, category } = req.body;

    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, budget, and deadline' });
    }

    const project = await Project.create({
      clientId: req.user.id,
      clientName: req.user.name,
      title,
      description,
      requirements: requirements || [],
      budget,
      deadline: new Date(deadline),
      category: category || 'general',
    });

    res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (client owner only)
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this project' });
    }

    const allowedUpdates = ['title', 'description', 'requirements', 'budget', 'deadline', 'status', 'category'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    res.json({ success: true, message: 'Project updated', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (client owner only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    project.isActive = false;
    await project.save();
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Place a bid on a project
// @route   POST /api/projects/:id/bids
// @access  Private (sparky only)
const placeBid = async (req, res) => {
  try {
    const { amount, proposal, estimatedDuration } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.status !== 'open') return res.status(400).json({ success: false, message: 'Project is no longer accepting bids' });

    // Check if sparky already bid
    const existingBid = project.bids.find((b) => b.sparkyId.toString() === req.user.id);
    if (existingBid) return res.status(400).json({ success: false, message: 'You have already placed a bid on this project' });

    project.bids.push({
      sparkyId: req.user.id,
      sparkyName: req.user.name,
      sparkyAvatar: req.user.avatarUrl || '',
      sparkyRating: req.user.overallRating || 0,
      amount,
      proposal,
      estimatedDuration,
    });

    await project.save();
    res.status(201).json({ success: true, message: 'Bid placed successfully', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept a bid
// @route   PUT /api/projects/:id/bids/:bidId/accept
// @access  Private (client owner only)
const acceptBid = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update all bids
    project.bids = project.bids.map((bid) => ({
      ...bid.toObject(),
      status: bid._id.toString() === req.params.bidId ? 'accepted' : 'rejected',
    }));

    const acceptedBid = project.bids.find((b) => b._id.toString() === req.params.bidId);
    project.status = 'assigned';
    project.assignedSparkyId = acceptedBid.sparkyId;

    await project.save();
    res.json({ success: true, message: 'Bid accepted', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get client's own projects
// @route   GET /api/projects/my/client
// @access  Private (client only)
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, placeBid, acceptBid, getMyProjects };
