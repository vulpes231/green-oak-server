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
    type: Number, // Store available balance as a fixed-point number
    get: (value) => {
      if (value === undefined) return value;
      return parseFloat(value).toFixed(2);
    },
    set: (value) => {
      if (typeof value === "string") {
        value = parseFloat(value);
      }
      // Round the value to 2 decimal places before storing
      return parseFloat(value.toFixed(2));
    },
  },
});

module.exports = mongoose.model("Account", accountSchema);
