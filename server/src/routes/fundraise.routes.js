const express = require('express');
const {
  getCampaigns, getMyCampaigns, getCampaign,
  createCampaign, donateToCampaign, deleteCampaign
} = require('../controllers/fundraise.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, getCampaigns);
router.get('/my', protect, getMyCampaigns);
router.get('/:id', protect, getCampaign);
router.post('/', protect, createCampaign);
router.post('/:id/donate', protect, donateToCampaign);
router.delete('/:id', protect, deleteCampaign);

module.exports = router;
