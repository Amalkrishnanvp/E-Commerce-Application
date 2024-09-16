const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const path = require("path");

/* GET Admin page */
router.get("/", async (req, res, next) => {
  // Call function to get all products
  const products = await productHelpers.getAllProducts();
  console.log(products);

  res.render("admin/view-products", { admin: true, products });
});

/* GET add product page */
router.get("/add-product", (req, res, next) => {
  res.render("admin/add-product", { admin: true });
});

/* POST add product details */
router.post("/add-product", async (req, res, next) => {
  try {
    // Store product data
    const productData = req.body;
    console.log(productData);

    // Store product image
    const productImage = req.files.Image;
    console.log(productImage);

    // Move product image to public folder
    productImage.mv("./public/product-images/" + productId + ".jpg", (err) => {
      if (!err) {
        res.render("admin/add-product");
      } else {
        console.error(err);
        res.status(500).send("Failed to upload image");
      }
    });

    // Making image path
    const imagePath = path.join("product-images", productId + ".jpg");
    console.log(imagePath);

    // Add product image path to product data
    productData.Image = imagePath;

    // Wait for the product to be added and to get the inserted id
    const data = await productHelpers.addProduct(productData);

    // Extract the inserted id
    const productId = data.insertedId;
    console.log("Inserted product id: " + productId);
  } catch (error) {
    console.error(err);
    res.status(500).send("Error adding product");
  }
});

module.exports = router;
