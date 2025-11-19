const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  ticker: { type: String, unique: true, required: true },
  company: { type: String },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Stock", StockSchema);
