const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connectDB };
