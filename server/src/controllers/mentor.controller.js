const { Mentor, MentorRequest } = require('../models/Mentor');
const User = require('../models/User');

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Private
const getMentors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    const query = { isActive: true };

    let mentors = await Mentor.find(query).sort({ rating: -1 });

    if (specialty) {
      mentors = mentors.filter((m) =>
        m.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    if (search) {
      const s = search.toLowerCase();
      mentors = mentors.filter(
        (m) => m.name.toLowerCase().includes(s) || m.title.toLowerCase().includes(s)
      );
    }

    res.json({ success: true, count: mentors.length, mentors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request a consultation
// @route   POST /api/mentors/:id/request
// @access  Private (client only)
const requestConsultation = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please describe what you would like to discuss (min 10 chars)' });
    }

    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });

    const client = await User.findById(req.user.id);
    if (client.credits < mentor.creditsPerSession) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. You need ${mentor.creditsPerSession} but have ${client.credits}`,
      });
    }

    // Deduct credits
    client.credits -= mentor.creditsPerSession;
    await client.save();

    const request = await MentorRequest.create({
      mentorId: mentor._id,
      clientId: req.user.id,
      clientName: req.user.name,
      message,
      credits: mentor.creditsPerSession,
    });

    res.status(201).json({
      success: true,
      message: 'Consultation request sent!',
      request,
      clientCredits: client.credits,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMentors, requestConsultation };
