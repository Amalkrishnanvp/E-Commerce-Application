const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const path = require("path");

/* GET Admin page */
router.get("/", async (req, res, next) => {
  // Access if session exists
  let user = req.session.user;

  // Call function to get all products
  const products = await productHelpers.getAllProducts();

  res.render("admin/view-products", { admin: true, products, user });
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

    // Store product image
    const productImage = req.files.Image;

    // Wait for the product to be added and to get the inserted id
    const data = await productHelpers.addProduct(productData);

    // Extract the inserted id
    const productId = data.insertedId;

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

    // Function to add image path
    productHelpers.addImagePath(productId, imagePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product");
  }
});

/* GET delete product */
router.get("/delete-product/:id", async (req, res, next) => {
  let productId = req.params.id;
  const response = await productHelpers.deleteProduct(productId);

  res.redirect("/admin");
});

/* GET edit product */
router.get("/edit-product/:id", async (req, res, next) => {
  let product = await productHelpers.getProductDetails(req.params.id);
  console.log(product);
  res.render("admin/edit-product", { product });
});

/* POST delete product */
router.post("/edit-product/:id", (req, res) => {
  let productId = req.params.id;
  console.log(productId);
  productHelpers.updateProduct(req.params.id, req.body);
});

module.exports = router;
