const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  ticker: String,
  price: Number
});

module.exports = mongoose.model("Stock", stockSchema);
