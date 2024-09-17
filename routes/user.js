const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");

/* GET - Render home page */
router.get("/", async (req, res, next) => {
  // Call function to get all products
  const products = await productHelpers.getAllProducts();

  res.render("user/view-products", { products });
});

/* GET - Render login page */
router.get("/login", (req, res, next) => {
  res.render("user/login");
});

/* GET - Render sign up page */
router.get("/signup", (req, res, next) => {
  res.render("user/signup");
});

/* POST - Handle sign up logic */
router.post("/signup", async (req, res, next) => {
  const data = req.body;

  // Pass user data to signup function
  const result = await userHelpers.doSignup(data);

  if (result.message) {
    res.status(201).send(result.message);
  } else {
    res.status(400).send(result.message);
  }
});

module.exports = router;
