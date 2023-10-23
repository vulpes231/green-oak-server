const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  account_owner: {
    type: String,
  },
  account_num: {
    type: Number,
  },
  account_type: {
    type: String,
  },
  available_bal: {
    type: Number,
  },
  current_bal: {
    type: Number,
  },
});

module.exports = mongoose.model("Account", accountSchema);
