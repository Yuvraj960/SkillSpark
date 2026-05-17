const express = require('express');
const {
  getUserProfile, updateProfile, completeOnboarding,
  addSkill, updateSkill, deleteSkill, getSparkies,
  addCredits, getSparkyDashboard
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/sparkies', protect, getSparkies);
router.get('/dashboard/sparky', protect, authorize('sparky'), getSparkyDashboard);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/onboarding', protect, authorize('sparky'), completeOnboarding);

// Skill routes (under users)
router.post('/skills', protect, authorize('sparky'), addSkill);
router.put('/skills/:skillId', protect, authorize('sparky'), updateSkill);
router.delete('/skills/:skillId', protect, authorize('sparky'), deleteSkill);

// Credits
router.post('/credits/add', protect, addCredits);

module.exports = router;
