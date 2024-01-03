const AddProduct = require("../models/addProduct");
const CartProduct = require("../models/cartProduct");

//Add To cart Product
exports.addToCart = async (req, res) => {
  try {
    const { email } = req.user;
    const { CartproductId, productQuantity, cartUpdateId, userEmail } =
      req.body;

    // Check if the cart is already in the database
    const existingCart = await CartProduct.findOne({ email });

    if (cartUpdateId && productQuantity && userEmail) {
      // Update the quantity of an existing product in the cart
      const cartItem = await CartProduct.findOneAndUpdate(
        { email: userEmail, "productId.productId": cartUpdateId },
        { $set: { "productId.$.productQuantity": productQuantity } },
        { new: true }
      );

      return cartItem
        ? res.status(200).json("Cart item updated successfully")
        : res.status(404).json("Cart item not found");
    }

    // Check if the product is already in the cart
    const existingProduct = existingCart?.productId.find(
      (product) => product.productId === CartproductId
    );

    if (existingProduct) {
      return res.status(200).json("Product already added to your Cart");
    }

    // Add a new product to the cart
    await CartProduct.updateOne(
      { email },
      {
        $push: { productId: { productId: CartproductId, productQuantity: 1 } },
      },
      { upsert: true }
    );

    return res.status(200).json("Product added successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error");
  }
};

// Get  cartproduct from the cartDB
exports.getCartProduct = async (req, res) => {
  try {
    const email = req.user.email;

    // Find the CartProduct document associated with the user's email
    const cartItem = await CartProduct.findOne({ email });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Extract the array of productIds from the cartItem
    const productIds = cartItem.productId.map((item) => item.productId);

    // Retrieve details for each productId from AddProduct database
    const productDetails = await AddProduct.find({
      _id: { $in: productIds },
    });

    // Create an array of objects combining productDetails and productQuantity
    const cartWithDetails = productDetails.map((detail, index) => ({
      ...detail.toObject(),
      productQuantity: cartItem.productId[index].productQuantity,
    }));

    res.status(200).json(cartWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Error");
  }
};

//Remove a product from the cart
exports.removeCartProduct = async (req, res) => {
  const { productId } = req.body;
  const email = req.user.email;
  try {
    // Check if productId and email are present
    if (productId && email) {
      // Use $pull to remove the specified productId from the CartProduct's productId array
      await CartProduct.updateOne(
        { email: email },
        { $pull: { productId: { productId: productId } } }
      );
      res.status(200).json("Card Item deleted successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Error");
  }
};
