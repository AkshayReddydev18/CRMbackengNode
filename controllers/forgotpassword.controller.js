

const User = require('../models/employeelogin.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// OTP expires in 15 minutes
const OTP_EXPIRY_MINUTES = 15;

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

// 1. Request password reset (generate OTP)
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000); // 15 minutes from now

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // TODO: Send OTP via email
  console.log(`OTP for ${email}: ${otp}`);

  res.json({ message: 'OTP sent to registered email.' });
};

// 2. Reset password using OTP
exports.resetPassword = async (req, res) => {
  const { email, otp, newpassword } = req.body;

  if (!email || !otp || !newpassword) {
    return res.status(400).json({ error: 'Email, OTP, and new password required.' });
  }

  if (!isStrongPassword(newpassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.'
    });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  if (!user.otp || user.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP.' });
  }

  if (user.otpExpiry < Date.now()) {
    return res.status(400).json({ error: 'OTP expired.' });
  }

  const hashedPassword = await bcrypt.hash(newpassword, 10);

  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful.' });
};
