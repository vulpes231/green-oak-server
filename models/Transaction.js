const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  trx_type: {
    type: String,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
