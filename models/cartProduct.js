const mongoose = require("mongoose");
const productId = new mongoose.Schema({
  productId: { type: String },
  productQuantity: { type: Number },
});
const cartProduct = new mongoose.Schema({
  email: { type: String },
  productId: [productId],
  checkOutProductId: { type: String },
});
module.exports = mongoose.model("cartProduct", cartProduct);
