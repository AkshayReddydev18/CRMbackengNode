// const User = require('../models/signup.model.js');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

function isStrongPassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  if (!isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: 'Signup successful.' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists.' });
    } else {
      res.status(500).json({ error: 'Server error.' });
    }
  }
};