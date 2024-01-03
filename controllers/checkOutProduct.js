const AddProduct = require("../models/addProduct");
const CartProduct = require("../models/cartProduct");

exports.checkOutProduct = async (req, res) => {
  try {
    const email = req.user.email;
    const { checkOutProductId, placeOrderHandler } = req.body;

    // Find or create the CartProduct document associated with the user's email
    let cartProduct = await CartProduct.findOne({ email });

    if (!cartProduct) {
      // Create a new CartProduct if it doesn't exist
      cartProduct = await CartProduct.create({
        email,
        productId: [],
      });
    }

    // Update checkOutProductId if provided
    if (checkOutProductId) {
      await CartProduct.findOneAndUpdate(
        { email },
        { $set: { checkOutProductId } }
      );
      return res.status(200).json("Check-out product updated successfully");
    } else if (placeOrderHandler) {
      // Clear checkOutProductId if placeOrderHandler is true
      await CartProduct.findOneAndUpdate(
        { email },
        { $set: { checkOutProductId: "" } }
      );
    }

    // Respond with a success message for placeOrderHandler
    res.status(200).json("Check-out product cleared successfully");
  } catch (error) {
    console.error("Error updating check-out product:", error);
    res.status(500).json("Server error");
  }
};

exports.getcheckOutProduct = async (req, res) => {
  try {
    const email = req.user.email;

    // Find the CartProduct document associated with the user's email
    const checkOutProduct = await CartProduct.findOne({ email });

    // Check if there is a checkOutProductId set
    if (checkOutProduct.checkOutProductId !== "") {
      // Retrieve details for the checkOutProductId from AddProduct database
      const checkOutProductDetails = await AddProduct.findOne({
        _id: checkOutProduct.checkOutProductId,
      });

      // Respond with the details of the checkOutProduct
      return res.status(200).json([checkOutProductDetails]);
    } else {
      // Find the CartProduct document associated with the user's email
      const cartItem = await CartProduct.findOne({ email });

      // Return a 404 response if the cart is not found
      if (!cartItem) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Extract the array of productIds and quantities from the cartItem
      const cartDetails = cartItem.productId.map((item) => ({
        productId: item.productId,
        productQuantity: item.productQuantity,
      }));

      // Retrieve details for each productId from AddProduct database
      const productDetails = await AddProduct.find({
        _id: { $in: cartDetails.map((item) => item.productId) },
      });

      // Combine productDetails and productQuantity into an array of objects
      const cartWithDetails = productDetails.map((detail, index) => ({
        ...detail.toObject(),
        productQuantity: cartDetails[index].productQuantity,
      }));

      // Respond with the details of the cart
      res.status(200).json(cartWithDetails);
    }
  } catch (error) {
    // Log any errors to the console
    console.error(error);

    // Respond with a 500 Internal Server Error if an error occurs
    res.status(500).send("Internal Error");
  }
};
