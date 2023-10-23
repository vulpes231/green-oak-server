const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  account_owner: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model or use a String if you want to store usernames
    required: true,
  },
  account_num: {
    type: String,
    required: true,
    unique: true, // Ensure account numbers are unique
  },
  account_type: {
    type: String,
    required: true,
  },
  available_bal: {
    type: Number, // Consider using integers or fixed-point decimals for monetary values
  },
  current_bal: {
    type: Number, // Consider using integers or fixed-point decimals for monetary values
  },
});

module.exports = mongoose.model("Account", accountSchema);
