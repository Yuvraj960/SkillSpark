const express = require('express');
const { getResources, getResource, saveResource } = require('../controllers/resource.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getResources);
router.get('/:id', protect, getResource);
router.post('/:id/save', protect, saveResource);

module.exports = router;
