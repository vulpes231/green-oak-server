const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  account_owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  account_num: {
    type: String,
    required: true,
    unique: true,
  },
  account_type: {
    type: String,
    required: true,
  },
  available_bal: {
    type: Number,
    default: 0,
  },
  current_bal: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Account", accountSchema);
