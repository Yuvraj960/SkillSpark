const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['article', 'video', 'interactive'], required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' }, // HTML or markdown for articles
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  readTime: { type: Number, default: 5 }, // in minutes
  duration: { type: Number, default: 0 }, // video duration in minutes
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
