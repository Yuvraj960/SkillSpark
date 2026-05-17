const express = require('express');
const { getSkillSuggestions, getProjectMatches, generateBio, getLearningPath } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/skill-suggestions', protect, getSkillSuggestions);
router.post('/project-match', protect, getProjectMatches);
router.post('/generate-bio', protect, generateBio);
router.post('/learning-path', protect, getLearningPath);

module.exports = router;
