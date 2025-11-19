// ...existing code...
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const safe = { id: user._id, name: user.name, email: user.email, amountDeposited: user.amountDeposited };
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(400).json("Signup failed");
  }
});

// Login (add login history)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Invalid Credentials");

    user.loginHistory.push({ loginAt: new Date() });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret123", { expiresIn: "7d" });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      amountDeposited: user.amountDeposited,
      stocksOwned: user.stocksOwned,
      loginHistory: user.loginHistory
    };

    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json("Login failed");
  }
});

// Add deposit
router.post("/deposit", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.user);
  user.amountDeposited += amount;
  await user.save();

  res.json(user);
});

// Get user dashboard info
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json(user);
});

module.exports = router;
// ...existing code...