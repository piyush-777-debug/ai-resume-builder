const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    name: { type: String, required: true },
    contact: {
      email: { type: String, required: true, trim: true },
      phone: { type: String },
      address: { type: String },
      linkedin: { type: String },
      github: { type: String },
      website: { type: String }
    },

    education: [
      {
        institute: String,
        degree: String,
        startYear: String,
        endYear: String,
        score: String
      }
    ],

    experiences: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String
      }
    ],

    skills: [{ type: String }],

    projects: [
      {
        title: String,
        link: String,
        description: String,
        tech: [String]
      }
    ],

    generatedText: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);
