const express = require('express');
const {
  getProjects, getProject, createProject, updateProject,
  deleteProject, placeBid, acceptBid, getMyProjects
} = require('../controllers/project.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getProjects);
router.get('/my/client', protect, authorize('client'), getMyProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, authorize('client'), createProject);
router.put('/:id', protect, authorize('client'), updateProject);
router.delete('/:id', protect, authorize('client'), deleteProject);
router.post('/:id/bids', protect, authorize('sparky'), placeBid);
router.put('/:id/bids/:bidId/accept', protect, authorize('client'), acceptBid);

module.exports = router;
