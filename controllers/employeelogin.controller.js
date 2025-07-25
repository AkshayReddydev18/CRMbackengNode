const User = require("../models/employeelogin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;


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
