const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const router = express.Router();
const Stock = require("../models/Stock");

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

// Deposit endpoint - validate numeric input safely
router.post("/deposit", auth, async (req, res) => {
  try {
    const amt = Number(req.body.amount);
    if (isNaN(amt) || amt <= 0) return res.status(400).json("Invalid amount");

    const user = await User.findById(req.user);
    // ensure existing value is numeric before adding
    const current = Number(user.amountDeposited) || 0;
    user.amountDeposited = current + amt;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Deposit failed");
  }
});

// Get user dashboard info
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json(user);
});

// Buy stocks: { ticker, quantity } - safe numeric handling
router.post("/buy", auth, async (req, res) => {
  try {
    const { ticker } = req.body;
    const qty = Number(req.body.quantity);
    if (!ticker || isNaN(qty) || qty <= 0) return res.status(400).json("Invalid buy parameters");

    const stock = await Stock.findOne({ ticker: ticker.toUpperCase() });
    if (!stock) return res.status(404).json("Stock not found");

    const user = await User.findById(req.user);
    const price = Number(stock.price);
    if (isNaN(price)) return res.status(500).json("Invalid stock price on server");

    const total = price * qty;
    const currentBalance = Number(user.amountDeposited) || 0;
    if (currentBalance < total) return res.status(400).json("Insufficient funds");

    // update holdings
    const existing = user.stocksOwned.find(s => s.ticker === stock.ticker);
    if (existing) {
      // update quantity and average price (weighted)
      const prevQty = Number(existing.quantity) || 0;
      const prevAvg = Number(existing.avgPrice) || price;
      const newQty = prevQty + qty;
      const newAvg = ((prevQty * prevAvg) + (qty * price)) / newQty;
      existing.quantity = newQty;
      existing.avgPrice = newAvg;
    } else {
      user.stocksOwned.push({ ticker: stock.ticker, quantity: qty, avgPrice: price });
    }

    user.amountDeposited = currentBalance - total;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Buy failed");
  }
});

module.exports = router;