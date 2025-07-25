// const mongoose = require('mongoose');

// const forgotPasswordSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   token: { type: String, required: true },
//   expiresAt: { type: Date, required: true }
// });

// module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);


const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema);
