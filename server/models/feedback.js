// models/Feedback.js

import mongoose from 'mongoose'; // Use import instead of require

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ensure you have a User model defined
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyLocation: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  placementType: {
    type: String,
    required: true
  },
  totalRounds: {
    type: Number,
    required: true,
    min: 1
  },
  rounds: [{
    roundName: String,
    questions: [String]
  }],
  additionalDetails: {
    type: String,
    default: ''  // Important:  Provide a default value
  },
  tips: {
    type: String,
    default: ''  // Important: Provide a default value
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  preparationTime: {
    type: String,
    default: '' // Provide a default value
  },
  skillsUsed: {
    type: String,
    default: '' // Provide a default value
  },
  privacyAgreement: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically.  Highly recommended.
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;