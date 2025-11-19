const express = require("express");
const Stock = require("../models/Stock");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// CRUD for Stocks (Admin use or static sample)
router.post("/", async (req, res) => {
  const stock = await Stock.create(req.body);
  res.json(stock);
});

router.get("/", async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
});

// Buy Stock
router.post("/buy", auth, async (req, res) => {
  const { ticker, quantity, price } = req.body;

  const user = await User.findById(req.user);

  const cost = quantity * price;
  if (user.amountDeposited < cost) return res.json("Not enough money");

  user.amountDeposited -= cost;

  const existing = user.stocksOwned.find(s => s.ticker === ticker);

  if (existing) existing.quantity += quantity;
  else user.stocksOwned.push({ ticker, quantity });

  await user.save();
  res.json(user);
});

// Sell Stock
router.post("/sell", auth, async (req, res) => {
  const { ticker, quantity, price } = req.body;

  const user = await User.findById(req.user);

  const stock = user.stocksOwned.find(s => s.ticker === ticker);
  if (!stock || stock.quantity < quantity)
    return res.json("Not enough stocks");

  stock.quantity -= quantity;
  user.amountDeposited += quantity * price;

  if (stock.quantity === 0)
    user.stocksOwned = user.stocksOwned.filter(s => s.ticker !== ticker);

  await user.save();
  res.json(user);
});

module.exports = router;
