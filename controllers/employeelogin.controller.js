const User = require("../models/employeelogin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
// Email config - from .env
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const OTP_EXPIRY_MINUTES = 15; // OTP expires in 15 minutes



function isStrongPassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  if (!isStrongPassword(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.",
      });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();
    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists." });
    } else {
      res.status(500).json({ error: "Server error." });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // 2. Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 3. Compare the provided password with the hashed one
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // 4. Create JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Respond with token
    res.json({ message: "Login successful.", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

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

  // Setup nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'smtp.ethereal.email' for testing
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to registered email.' });
  } catch (err) {
    console.error('Email sending failed:', err);
    res.status(500).json({ error: 'Failed to send OTP email.' });
  }
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

  // Safely check if otpExpiry exists and is not expired
  if (!user.otpExpiry || user.otpExpiry < Date.now()) {
    return res.status(400).json({ error: 'OTP expired.' });
  }

  const hashedPassword = await bcrypt.hash(newpassword, 10);

  user.password = hashedPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful.' });
};
