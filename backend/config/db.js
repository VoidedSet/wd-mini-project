const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //await mongoose.connect("mongodb://localhost:27017/stocks")//return a promise

    await mongoose.connect("mongodb://127.0.0.1:27017/stocks")//return a promise
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
