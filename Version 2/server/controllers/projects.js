const Project = require('../models/Project');
const User = require('../models/User');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, skillsRequired, deadline } = req.body;
    
    const newProject = new Project({
      title,
      description,
      skillsRequired: skillsRequired.split(',').map(skill => skill.trim()),
      clientId: req.user.id,
      deadline
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects (for Sparkies)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' })
      .populate('clientId', 'username fullName githubUsername');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'username fullName githubUsername')
      .populate('bids.sparkyId', 'username fullName githubUsername skills');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit bid
exports.submitBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if already bid
    const existingBid = project.bids.find(bid => bid.sparkyId.toString() === req.user.id);
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this project' });
    }

    project.bids.push({
      sparkyId: req.user.id,
      amount
    });

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign project to Sparky
exports.assignProject = async (req, res) => {
  try {
    const { sparkyId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if client owns the project
    if (project.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update project
    project.assignedTo = sparkyId;
    project.status = 'assigned';
    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get client's projects
exports.getClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.params.clientId })
      .populate('assignedTo', 'username fullName githubUsername');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sparky's projects
exports.getSparkyProjects = async (req, res) => {
  try {
    const assignedProjects = await Project.find({ 
      assignedTo: req.params.sparkyId,
      status: { $in: ['assigned', 'completed'] }
    }).populate('clientId', 'username fullName githubUsername');

    const bidProjects = await Project.find({
      'bids.sparkyId': req.params.sparkyId,
      status: 'open'
    }).populate('clientId', 'username fullName githubUsername');

    res.json({
      assignedProjects,
      bidProjects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};