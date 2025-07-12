const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  sparkyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsRequired: { type: [String], required: true },
  bids: [BidSchema],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['open', 'assigned', 'completed'], 
    default: 'open' 
  },
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date }
});

module.exports = mongoose.model('Project', ProjectSchema);