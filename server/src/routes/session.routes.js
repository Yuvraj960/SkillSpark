const express = require('express');
const { bookSession, getMySessions, cancelSession, completeSession } = require('../controllers/session.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getMySessions);
router.post('/', protect, authorize('client'), bookSession);
router.put('/:id/cancel', protect, cancelSession);
router.put('/:id/complete', protect, completeSession);

module.exports = router;
