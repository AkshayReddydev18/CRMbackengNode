const User = require('../models/employeelogin.model');
const bcrypt = require('bcrypt');

// ✅ Password strength checker (reuse this)
function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

exports.resetPassword = async (req, res) => {
  const { email, newpassword } = req.body;

  if (!email || !newpassword) {
    return res.status(400).json({ error: 'Email and new password required.' });
  }

  // ✅ Check password strength
  if (!isStrongPassword(newpassword)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.'
    });
  }

  try {
    const hashed = await bcrypt.hash(newpassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashed }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};
