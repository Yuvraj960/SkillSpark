const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  bio: { type: String, default: '' },
  experience: { type: String, required: true },
  specialties: [{ type: String }],
  creditsPerSession: { type: Number, required: true },
  availability: { type: String, default: '2-3 days' },
  avatarUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  totalSessions: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }],
}, { timestamps: true });

const mentorRequestSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  credits: { type: Number, required: true },
}, { timestamps: true });

const Mentor = mongoose.model('Mentor', mentorSchema);
const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);

module.exports = { Mentor, MentorRequest };
