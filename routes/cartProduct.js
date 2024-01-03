const express = require("express");
const cartProductRoutes = express.Router();
const verifyToken = require("../utils/verifyJwtToken");

const cartProduct = require("../controllers/cartProduct");
cartProductRoutes.post("/getCartProduct", verifyToken, cartProduct.addToCart);
cartProductRoutes.get(
  "/getCartProduct",
  verifyToken,
  cartProduct.getCartProduct
);
cartProductRoutes.post(
  "/removeCartProduct",
  verifyToken,
  cartProduct.removeCartProduct
);

module.exports = cartProductRoutes;
