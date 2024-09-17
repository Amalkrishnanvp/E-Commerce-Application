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

/* POST - Handle login logic */
router.post("/login", async (req, res) => {
  try {
    const data = req.body;

    const result = await userHelpers.doLogin(data);

    if (result.logged) {
      if (result.role === "admin") {
        res.redirect("/admin");
      } else if (result.role === "user") {
        res.redirect("/");
      }
    } else {
      return res.status(400).send(result.message);
    }
  } catch (error) {
    console.error("Error in login route: ", error);
    return res.status(400).send("Internal server error");
  }
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
    res.redirect("/");
  } else {
    res.status(400).send(result.message);
  }
});

module.exports = router;
