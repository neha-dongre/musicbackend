const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json({ limit: "50mb" }));
var cors = require("cors");
app.use(cors());
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const mongoDb = require("./utils/databaseConnection");
const user = require("./routes/user");
const order = require("./routes/order");
const cartProduct = require("./routes/cartProduct");
const checkOutProduct = require("./routes/checkOutProduct");
const product = require("./routes/product");
app.use(user);
app.use(order);
app.use(cartProduct);
app.use(checkOutProduct);
app.use(product);

app.listen(4000, () => {
  console.log("connected");

});
