const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");

// Function to verify login
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET - Render home page */
router.get("/", async (req, res, next) => {
  // Access if session exists
  let user = req.session.user;

  // Call function to get all products
  const products = await productHelpers.getAllProducts();

  res.render("user/view-products", { products, user });
});

/* GET - Render login page */
router.get("/login", (req, res, next) => {
  // render login page and products page based on logged in state
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});

/* POST - Handle login logic */
router.post("/login", async (req, res) => {
  try {
    const data = req.body;

    const result = await userHelpers.doLogin(data);

    if (result.logged) {
      if (result.role === "admin") {
        req.session.loggedIn = true;

        // Save user data to session
        req.session.user = result.userData;

        res.redirect("/admin");
      } else if (result.role === "user") {
        req.session.loggedIn = true;

        // Save user data to session
        req.session.user = result.userData;

        res.redirect("/");
      } else {
        req.session.loginErr = true;
        res.redirect("/login");
      }
    } else {
      req.session.loginErr = true;
      res.redirect("/login");
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
  console.log(result);
  console.log(result.userData);

  if (result.message) {
    req.session.loggedIn = true;
    req.session.user = result.userData;
    res.redirect("/");
  } else {
    res.status(400).send(result.message);
  }
});

/* GET - Render Log out page */
router.get("/logout", (req, res, next) => {
  // Destroy session when log out
  req.session.destroy();
  res.redirect("/");
});

/* GET - Render Cart page */
router.get("/cart", verifyLogin, async (req, res, next) => {
  let products = await userHelpers.getCartProducts(req.session.user._id);
  console.log("hello", products);

  res.render("user/cart");
});

/* GET - Add product to cart */
router.get("/add-to-cart/:id", verifyLogin, async (req, res, next) => {
  const result = await userHelpers.addToCart(
    req.params.id,
    req.session.user._id
  );

  res.redirect("/");
});

module.exports = router;
