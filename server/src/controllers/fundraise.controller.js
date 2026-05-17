const Campaign = require('../models/Campaign');
const User = require('../models/User');

// @desc    Get all active campaigns
// @route   GET /api/fundraise
// @access  Private
const getCampaigns = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = { isActive: true };
    if (status) query.status = status;
    else query.status = 'active';

    let campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      campaigns = campaigns.filter(
        (c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
      );
    }

    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my campaigns
// @route   GET /api/fundraise/my
// @access  Private
const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creatorId: req.user.id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single campaign
// @route   GET /api/fundraise/:id
// @access  Private
const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create campaign
// @route   POST /api/fundraise
// @access  Private
const createCampaign = async (req, res) => {
  try {
    const { title, description, goal, duration, visibility, category } = req.body;

    if (!title || !description || !goal || !duration) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, goal, and duration' });
    }

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + parseInt(duration));

    const campaign = await Campaign.create({
      creatorId: req.user.id,
      creatorName: req.user.name,
      creatorType: req.user.type,
      title,
      description,
      goal: parseInt(goal),
      endsAt,
      visibility: visibility || 'public',
      category: category || 'general',
    });

    res.status(201).json({ success: true, message: 'Campaign created', campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Donate to a campaign
// @route   POST /api/fundraise/:id/donate
// @access  Private
const donateToCampaign = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid donation amount' });
    }

    const donor = await User.findById(req.user.id);
    if (donor.credits < amount) {
      return res.status(400).json({ success: false, message: `Insufficient credits. You have ${donor.credits}` });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Campaign not found or inactive' });
    }

    // Deduct credits from donor
    donor.credits -= amount;
    await donor.save();

    // Add to campaign
    campaign.raised += amount;
    campaign.backers.push({ userId: req.user.id, amount });
    if (campaign.raised >= campaign.goal) campaign.status = 'funded';
    await campaign.save();

    res.json({ success: true, message: `Donated ${amount} credits!`, campaign, donorCredits: donor.credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel/Delete campaign
// @route   DELETE /api/fundraise/:id
// @access  Private (owner only)
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

    if (campaign.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    campaign.isActive = false;
    campaign.status = 'cancelled';
    await campaign.save();

    res.json({ success: true, message: 'Campaign cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCampaigns, getMyCampaigns, getCampaign, createCampaign, donateToCampaign, deleteCampaign };
