// const User = require('../models/employeelogin.model');
// const bcrypt = require('bcrypt');

// // ✅ Password strength checker (reuse this)
// function isStrongPassword(password) {
//   return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
// }

// exports.resetPassword = async (req, res) => {
//   const { email, newpassword } = req.body;

//   if (!email || !newpassword) {
//     return res.status(400).json({ error: 'Email and new password required.' });
//   }

//   // ✅ Check password strength
//   if (!isStrongPassword(newpassword)) {
//     return res.status(400).json({
//       error: 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.'
//     });
//   }

//   try {
//     const hashed = await bcrypt.hash(newpassword, 10);
//     const user = await User.findOneAndUpdate(
//       { email },
//       { password: hashed }
//     );

//     if (!user) {
//       return res.status(404).json({ error: 'User not found.' });
//     }

//     res.json({ message: 'Password reset successful.' });
//   } catch (err) {
//     console.error('Reset error:', err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// };


const User = require('../models/employeelogin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Use an environment variable in production

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

// 1. Request password reset (generate token)
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Generate a token valid for 15 minutes
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });

  // TODO: Send token via email. For demo, return in response:
  res.json({ message: 'Password reset token generated.', token });
};

// 2. Reset password using token
exports.resetPassword = async (req, res) => {
  const { token, newpassword } = req.body;

  if (!token || !newpassword) {
    return res.status(400).json({ error: 'Token and new password required.' });
  }

  if (!isStrongPassword(newpassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const hashed = await bcrypt.hash(newpassword, 10);
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashed }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};