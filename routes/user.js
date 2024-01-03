const express = require("express");
const userRoutes = express.Router();
const verifyToken = require("../utils/verifyJwtToken");

const user = require("../controllers/user");
userRoutes.post("/register", user.register);
userRoutes.post("/login", user.login);
userRoutes.get("/verifyUser", verifyToken, user.verifyUser);
module.exports = userRoutes;
