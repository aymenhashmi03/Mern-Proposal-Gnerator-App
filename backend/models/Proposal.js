const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  projectDescription: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected', 'In Review'],
    default: 'Draft'
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
proposalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Proposal', proposalSchema);

