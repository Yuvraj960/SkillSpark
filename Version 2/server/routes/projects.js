const express = require('express');
const router = express.Router();
const { 
  createProject,
  getAllProjects,
  getProjectById,
  submitBid,
  assignProject,
  getClientProjects,
  getSparkyProjects
} = require('../controllers/projects');

// Create project
router.post('/', createProject);

// Get all projects (for Sparkies)
router.get('/', getAllProjects);

// Get project by ID
router.get('/:id', getProjectById);

// Submit bid
router.post('/:id/bids', submitBid);

// Assign project
router.put('/:id/assign', assignProject);

// Get client's projects
router.get('/client/:clientId', getClientProjects);

// Get sparky's projects
router.get('/sparky/:sparkyId', getSparkyProjects);

module.exports = router;