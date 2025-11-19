const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // total money user has deposited
  amountDeposited: { type: Number, default: 0 },

  // user stocks data
  stocksOwned: [
    {
      ticker: String,
      quantity: Number,
    }
  ],

  // login history timestamps
  loginHistory: [
    {
      loginAt: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
