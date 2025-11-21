const mongoose = require("mongoose"); //load mongoose library from node_modulep

const StockSchema = new mongoose.Schema({
  ticker: { type: String, unique: true, required: true },
  company: { type: String },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Stock", StockSchema);

// Example Stock Document:
  // {
  //   "ticker": "NVDA",
  //   "company": "NVIDIA Corporation",
  //   "price": 1100,
  //   "createdAt": { "$date": "2025-11-19T13:24:56.000Z" },
  //   "updatedAt": { "$date": "2025-11-19T13:24:56.000Z" }
  // }