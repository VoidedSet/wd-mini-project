const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  amountDeposited: { type: Number, default: 0 },
  stocksOwned: [
    {
      ticker: String,
      quantity: Number,
    }
  ],
  loginHistory: [
    {
      loginAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
