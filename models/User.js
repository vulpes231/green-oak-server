const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  account_type: {
    type: String,
  },
  account_no: {
    type: Number,
  },
});

module.exports = mongoose.model("User", userSchema);
