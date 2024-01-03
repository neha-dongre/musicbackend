const express = require("express");
const orderRoutes = express.Router();
const verifyToken = require("../utils/verifyJwtToken");

const order = require("../controllers/order");

orderRoutes.post("/orderProduct", verifyToken, order.orderProduct);

module.exports = orderRoutes;
