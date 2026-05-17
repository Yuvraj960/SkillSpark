const express = require('express');
const { getMentors, requestConsultation } = require('../controllers/mentor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getMentors);
router.post('/:id/request', protect, authorize('client'), requestConsultation);

module.exports = router;
