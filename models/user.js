const mongoose = require("mongoose");

const user = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, unique: true },
  number: { type: Number, unique: true },
  password: { type: String },
});
module.exports = mongoose.model("User", user);
