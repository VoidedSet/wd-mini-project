const express = require("express");
const Stock = require("../models/Stock");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

console.log("stockRoutes loaded"); // confirm at server start

// list all market stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ ticker: 1 });
    res.json(stocks);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch stocks");
  }
});

// add a stock to market
router.post("/add", auth, async (req, res) => {
  try {
    const { ticker, company } = req.body;
    const price = Number(req.body.price);
    if (!ticker || isNaN(price) || price < 0) return res.status(400).json("Invalid ticker or price");

    const created = await Stock.create({ ticker: ticker.toUpperCase(), company, price });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(409).json("Ticker already exists");
    res.status(500).json("Failed to add stock");
  }
});

// sell stocks (persist changes to DB)
router.post("/sell", auth, async (req, res) => {
  try {
    const { ticker } = req.body;
    const qty = Number(req.body.quantity);
    if (!ticker || isNaN(qty) || qty <= 0) return res.status(400).json("Invalid sell parameters");

    const stock = await Stock.findOne({ ticker: ticker.toUpperCase() });
    if (!stock) return res.status(404).json("Stock not found");

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json("User not found");

    const holdingIdx = user.stocksOwned.findIndex(s => s.ticker === stock.ticker);
    if (holdingIdx === -1) return res.status(400).json("You do not own this stock");

    const holding = user.stocksOwned[holdingIdx];
    const currQty = Number(holding.quantity) || 0;
    if (currQty < qty) return res.status(400).json("Not enough shares to sell");

    const price = Number(stock.price);
    if (isNaN(price)) return res.status(500).json("Invalid stock price");

    const total = price * qty;
    user.amountDeposited = (Number(user.amountDeposited) || 0) + total;

    holding.quantity = currQty - qty;
    if (holding.quantity <= 0) user.stocksOwned.splice(holdingIdx, 1);

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Sell failed");
  }
});

module.exports = router;
