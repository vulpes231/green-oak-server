const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  accountNum: {
    type: String,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
