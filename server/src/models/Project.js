const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  sparkyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sparkyName: { type: String, required: true },
  sparkyAvatar: { type: String, default: '' },
  sparkyRating: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  proposal: { type: String, required: true, minlength: [20, 'Proposal must be at least 20 characters'] },
  estimatedDuration: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
  description: { type: String, required: true, minlength: [30, 'Description must be at least 30 characters'] },
  requirements: [{ type: String }],
  budget: { type: Number, required: true, min: [1, 'Budget must be at least 1 credit'] },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'open',
  },
  assignedSparkyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bids: [bidSchema],
  category: { type: String, default: 'general' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
