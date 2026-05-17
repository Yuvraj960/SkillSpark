const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sparkyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sparkyName: { type: String, required: true },
  sparkyAvatar: { type: String, default: '' },
  title: { type: String, required: true },
  skillName: { type: String, default: '' },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // in minutes
  credits: { type: Number, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
    default: 'upcoming',
  },
  meetingLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  clientReview: {
    rating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
