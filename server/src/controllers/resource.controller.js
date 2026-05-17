const Resource = require('../models/Resource');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const { type, category, search } = req.query;
    const query = { isActive: true };

    if (type) query.type = type;
    if (category) query.category = new RegExp(category, 'i');

    let resources = await Resource.find(query).sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      resources = resources.filter(
        (r) => r.title.toLowerCase().includes(s) || r.tags.some((t) => t.toLowerCase().includes(s))
      );
    }

    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
const getResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Bookmark a resource
// @route   POST /api/resources/:id/save
// @access  Private
const saveResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    const alreadySaved = resource.saves.includes(req.user.id);
    if (alreadySaved) {
      resource.saves = resource.saves.filter((id) => id.toString() !== req.user.id);
    } else {
      resource.saves.push(req.user.id);
    }
    await resource.save();

    res.json({ success: true, saved: !alreadySaved, savesCount: resource.saves.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getResources, getResource, saveResource };
