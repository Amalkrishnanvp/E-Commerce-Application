const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");

/* GET Home page */
router.get("/", async (req, res, next) => {
  // Call function to get all products
  const products = await productHelpers.getAllProducts();
  console.log(products);

  res.render("index", {
    title: "E-commerce application",
    products,
    admin: false,
  });
});

module.exports = router;
