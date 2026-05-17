const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Book a session with a sparky
// @route   POST /api/sessions
// @access  Private (client only)
const bookSession = async (req, res) => {
  try {
    const { sparkyId, skillName, scheduledAt, duration, credits } = req.body;

    if (!sparkyId || !scheduledAt || !credits) {
      return res.status(400).json({ success: false, message: 'Please provide sparkyId, scheduledAt, and credits' });
    }

    const sparky = await User.findById(sparkyId);
    if (!sparky || sparky.type !== 'sparky') {
      return res.status(404).json({ success: false, message: 'Sparky not found' });
    }

    const client = await User.findById(req.user.id);
    if (client.credits < credits) {
      return res.status(400).json({ success: false, message: `Insufficient credits. You need ${credits} but have ${client.credits}` });
    }

    // Deduct credits from client
    client.credits -= credits;
    client.totalSpent += credits;
    await client.save();

    const session = await Session.create({
      clientId: req.user.id,
      sparkyId,
      sparkyName: sparky.name,
      sparkyAvatar: sparky.avatarUrl || '',
      title: skillName ? `Session: ${skillName}` : `Session with ${sparky.name}`,
      skillName: skillName || '',
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      credits,
    });

    res.status(201).json({ success: true, message: 'Session booked successfully', session, clientCredits: client.credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sessions for current user
// @route   GET /api/sessions
// @access  Private
const getMySessions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = req.user.type === 'client'
      ? { clientId: req.user.id }
      : { sparkyId: req.user.id };

    if (status) query.status = status;

    const sessions = await Session.find(query).sort({ scheduledAt: -1 });
    res.json({ success: true, sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a session
// @route   PUT /api/sessions/:id/cancel
// @access  Private
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    // Verify ownership
    const isOwner = session.clientId.toString() === req.user.id || session.sparkyId.toString() === req.user.id;
    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized' });

    if (session.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Only upcoming sessions can be cancelled' });
    }

    session.status = 'cancelled';
    await session.save();

    // Refund credits to client
    await User.findByIdAndUpdate(session.clientId, {
      $inc: { credits: session.credits, totalSpent: -session.credits },
    });

    res.json({ success: true, message: 'Session cancelled and credits refunded', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a session and leave review
// @route   PUT /api/sessions/:id/complete
// @access  Private
const completeSession = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    session.status = 'completed';
    if (rating) {
      session.clientReview = { rating, comment: comment || '' };
    }
    await session.save();

    // Update sparky stats
    const sparky = await User.findById(session.sparkyId);
    sparky.sessionsCompleted += 1;
    sparky.totalEarnings += session.credits;
    sparky.credits += session.credits;
    if (rating) {
      const newTotal = sparky.totalReviews + 1;
      sparky.overallRating = ((sparky.overallRating * sparky.totalReviews) + rating) / newTotal;
      sparky.totalReviews = newTotal;
    }
    await sparky.save();

    res.json({ success: true, message: 'Session completed', session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { bookSession, getMySessions, cancelSession, completeSession };
