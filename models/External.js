const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const externalSchema = new Schema({
  username: {
    type: String,
  },
  routing: {
    type: String,
  },
  account: {
    type: String,
  },
  nick: {
    type: String,
  },
  type: {
    type: String,
  },
});

module.exports = mongoose.model("External", externalSchema);
