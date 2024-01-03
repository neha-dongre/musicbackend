const mongoose = require("mongoose");
const productId = new mongoose.Schema({
  productId: { type: String },
  productQuantity: { type: Number },
});
const userOrder = new mongoose.Schema({
  email: { type: String, unique: true },
  productId: [productId],
});
module.exports = mongoose.model("UserOrder", userOrder);
