const express = require("express");
const checkOutProductRoutes = express.Router();
const verifyToken = require("../utils/verifyJwtToken");

const checkOutProduct = require("../controllers/checkOutProduct");

checkOutProductRoutes.post(
  "/checkOutProduct",
  verifyToken,
  checkOutProduct.checkOutProduct
);
checkOutProductRoutes.get(
  "/checkOutProduct",
  verifyToken,
  checkOutProduct.getcheckOutProduct
);

module.exports = checkOutProductRoutes;
