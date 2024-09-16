const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");

/* GET Home page */
router.get("/", async (req, res, next) => {
  // Call function to get all products
  const products = await productHelpers.getAllProducts();

  res.render("user/view-products", { products });
});

/* GET Login page */
router.get("/login", (req, res, next) => {
  res.render("user/login");
});

/* GET Sign up page */
router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

module.exports = router;
