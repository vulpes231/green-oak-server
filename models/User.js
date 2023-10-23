const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email addresses are unique
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    // Add validation logic for phone numbers here if needed
  },
  account_type: {
    type: String,
    required: true,
  },
  account_no: {
    type: String,
    required: true,
    unique: true, // Ensure account numbers are unique
  },
  refresh_token: {
    type: String,
    // Consider storing refresh tokens securely, possibly outside this document
  },
});

module.exports = mongoose.model("User", userSchema);
