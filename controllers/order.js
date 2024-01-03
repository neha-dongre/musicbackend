const CartProduct = require("../models/cartProduct");
const UserOrderProduct = require("../models/order");

exports.orderProduct = async (req, res) => {
  try {
    const email = req.user.email;

    // Find or create the userOrder with the given email
    let userOrder = await UserOrderProduct.findOneAndUpdate(
      { email },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Find the corresponding cartProduct
    const cartProduct = await CartProduct.findOne({ email });

    if (!cartProduct) {
      return res.status(404).send("Cart is empty");
    }

    if (cartProduct.checkOutProductId === "") {
      // Update userOrder with the cartProduct data
      cartProduct.productId.forEach((cartItem) => {
        const existingProductIndex = userOrder.productId.findIndex(
          (orderItem) => orderItem.productId === cartItem.productId
        );

        existingProductIndex !== -1
          ? (userOrder.productId[existingProductIndex].productQuantity +=
              cartItem.productQuantity)
          : userOrder.productId.push(cartItem);
      });

      await userOrder.save();

      // Optionally, to clear the cart after placing the order
      await CartProduct.findOneAndUpdate(
        { email },
        { $set: { productId: [] } }
      );

      return res.status(200).send("Order placed successfully");
    }

    // Check if checkOutProductId already exists in userOrder
    const existingProductIndex = userOrder.productId.findIndex(
      (orderItem) => orderItem.productId === cartProduct.checkOutProductId
    );

    existingProductIndex !== -1
      ? (userOrder.productId[existingProductIndex].productQuantity += 1)
      : userOrder.productId.push({
          productId: cartProduct.checkOutProductId,
          productQuantity: 1,
        });

    await userOrder.save();

    return res.status(200).send("Order placed successfully");
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(400).send("Error placing order");
  }
};
