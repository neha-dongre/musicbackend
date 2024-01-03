const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

// User registration
exports.register = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    // Check if required fields are provided
    if (name && email && number && password) {
      const oldUser = await User.findOne({ email });

      // Check if user with the same email already exists
      if (!oldUser) {
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
          name,
          email: email.toLowerCase(),
          number,
          password: encryptedPassword,
        });

        // Generate and send a JWT token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY
        );

        res.status(201).json({ email: user.email, token });
      } else {
        // User already exists
        res.status(409).send("User already exists. Please login.");
      }
    } else {
      // Missing required fields
      res.status(400).send("All input fields are required");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Error");
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (email && password) {
      const user = await User.findOne({ email });

      // Check if user exists and password is correct
      if (user && (await bcrypt.compare(password, user.password))) {
        // Generate and send a JWT token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY
        );

        res.status(200).json({ email: user.email, token });
      } else {
        // Invalid credentials
        res.status(400).send("Invalid credentials");
      }
    } else {
      // Missing email or password
      res.status(400).send("All input is required");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Error");
  }
};

// Verify user (dummy endpoint)
exports.verifyUser = (req, res) => {
  res.send(true);
};
