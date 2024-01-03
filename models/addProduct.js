const mongoose = require("mongoose");

const addProductSchema = new mongoose.Schema({
  productImage: { type: Array },
  productDetailName: { type: String },
  productName: { type: String },
  productPrice: { type: String },
  productColor: { type: String },
  productAbout: { type: String },
  productStock: { type: Boolean },
  productBrand: { type: String },
  productType: { type: String },
});
module.exports = mongoose.model("addProduct", addProductSchema);
