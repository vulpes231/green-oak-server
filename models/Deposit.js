const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const depositSchema = new Schema({
  depositor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  deposit_account: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  deposit_date: {
    type: String,
    required: true,
  },
  available_date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Deposit", depositSchema);
