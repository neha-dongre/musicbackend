const AddProduct = require("../models/addProduct");

exports.getProduct = async (req, res) => {
  // Initialize an empty object to store filters
  const filters = {};
  try {
    if (req.query.headPhoneType) {
      filters.productType = req.query.headPhoneType;
    }

    if (req.query.companyType) {
      filters.productBrand = req.query.companyType;
    }
    if (req.query.headPhoneColor) {
      filters.productColor = req.query.headPhoneColor;
    }
    if (req.query.inputSearch) {
      filters.productName = req.query.inputSearch;
      filters.productName = new RegExp(`^${req.query.inputSearch}`, "i");
    }
    if (req.query.headPhonePrice) {
      const priceRange = req.query.headPhonePrice.split("-");
      filters.productPrice = {
        $gte: priceRange[0],
        $lte: priceRange[1],
      };
    }

    // Fetch ProductDetails based on applied filters
    const ProductDetails = await AddProduct.find(filters);

    res.status(200).send(ProductDetails);
  } catch (error) {
    res.status(500).send("Internal Error");
  }
};
exports.addProduct = async (req, res) => {
  try {
    const {
      productImage,
      productDetailName,
      productName,
      productType,
      productPrice,
      productColor,
      productAbout,
      productStock,
      productBrand,
    } = req.body;

    // Check if a product with the same productAbout already exists
    const oldSameProduct = await AddProduct.findOne({ productAbout });

    // Validate required fields
    const requiredFields = [
      productImage,
      productName,
      productDetailName,
      productPrice,
      productColor,
      productAbout,
      productStock,
      productBrand,
      productType,
    ];

    if (
      requiredFields.every((field) => field !== undefined) &&
      !oldSameProduct
    ) {
      const addProduct = await AddProduct.create({
        productImage,
        productName,
        productDetailName,
        productPrice,
        productAbout,
        productColor,
        productStock,
        productBrand,
        productType,
      });
      return res.status(201).json(addProduct);
    } else if (requiredFields.some((field) => field === undefined)) {
      return res.status(400).send("All input fields are required");
    } else if (oldSameProduct) {
      return res.status(409).send("Product already exists. Please login");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).send("Internal Error");
  }
};

exports.productdetails = async (req, res) => {
  try {
    // Retrieve product details by ID
    const addProduct = await AddProduct.findById(req.params.id);

    // Check if the product with the given ID exists
    if (!addProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send product details in the response
    res.status(200).json(addProduct);
  } catch (err) {
    // Handle internal server error
    console.error("Error fetching product details:", err);
    res.status(500).send("Internal Error");
  }
};
