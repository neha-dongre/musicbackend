const express = require("express");
const productRoutes = express.Router();
const verifyToken = require("../utils/verifyJwtToken");

const product = require("../controllers/product");
productRoutes.get("/", product.getProduct);
productRoutes.post("/addProduct", verifyToken, product.addProduct);
productRoutes.get("/productdetails/:id", product.productdetails);

module.exports = productRoutes;
