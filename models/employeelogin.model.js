

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,    // Normalize email
//     trim: true,         // Remove extra spaces
//     match: [/.+\@.+\..+/, 'Please enter a valid email address'] // Basic email format validation
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8        // Enforces minimum length in the schema itself
//   },
//   otp: {
//     type: String
//   },
//   otpExpiry: {
//     type: Date
//   }
// }, {
//   timestamps: true // Adds createdAt and updatedAt automatically
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

