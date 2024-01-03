const mongoose = require("mongoose");

const mongoDb = mongoose
  .connect(process.env.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected!"))
  .catch((err) => console.error("Connection error:", err));

module.exports = mongoDb;
