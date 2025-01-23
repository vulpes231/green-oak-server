const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const externalSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
