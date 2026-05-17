const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: { type: String, required: true },
  creatorType: { type: String, enum: ['sparky', 'client'], required: true },
  title: { type: String, required: true, trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
  description: { type: String, required: true, minlength: [20, 'Description must be at least 20 characters'] },
  goal: { type: Number, required: true, min: [10, 'Goal must be at least 10 credits'] },
  raised: { type: Number, default: 0 },
  backers: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    donatedAt: { type: Date, default: Date.now },
  }],
  endsAt: { type: Date, required: true },
  imageUrl: { type: String, default: '' },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  status: { type: String, enum: ['active', 'funded', 'expired', 'cancelled'], default: 'active' },
  category: { type: String, default: 'general' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual for days left
campaignSchema.virtual('daysLeft').get(function () {
  const now = new Date();
  const diff = this.endsAt - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Virtual for progress %
campaignSchema.virtual('progressPercent').get(function () {
  return Math.min(100, Math.round((this.raised / this.goal) * 100));
});

campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
