const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
const dbModule = require("../config/connection");
const essentials = require("../config/essentials");
const ObjectId = require("mongodb").ObjectId;

// Function to verify login
const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn && req.session.role === "user") {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET - Render home page */
router.get("/", async (req, res, next) => {
  // Access if session exists
  let user = req.session.user;
  let cartCount = null;

  // Call function to get all products
  const products = await productHelpers.getAllProducts();

  if (user) {
    let userId = req.session.user._id;
    cartCount = await userHelpers.getCartCount(userId);
  }

  res.render("user/view-products", { products, user, cartCount });
});

/* GET - Render login page */
router.get("/login", (req, res, next) => {
  // render login page and products page based on logged in state
  if (req.session.loggedIn && req.session.user.role === "user") {
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
    console.log(result)

    if (result.logged) {
      if (result.role === "admin") {
        req.session.loggedIn = true;

        // Save user data to session
        req.session.user = result.userData;
        console.log(req.session);

        console.log(req.session.user);

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
  // Access if session exists
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = null;
  let total;

  let products = await userHelpers.getCartProducts(userId);

  if (user) {
    cartCount = await userHelpers.getCartCount(userId);
  }

  if (cartCount) {
    total = await userHelpers.getTotalAmount(userId);
  }

  res.render("user/cart", { products, user, cartCount, total });
});

/* GET - Add product to cart */
router.get("/add-to-cart/:id", async (req, res, next) => {
  const result = await userHelpers.addToCart(
    req.params.id,
    req.session.user._id
  );

  return res.json({ status: true });
});

/* POST - Quantity increment */
router.post("/change-product-quantity", async (req, res, next) => {
  let user = req.session.user;
  let userId = req.session.user._id;

  const result = await userHelpers.changeProductQuantity(req.body);
  let total = await userHelpers.getTotalAmount(userId);
  res.json({ result, total });
});

/* POST - remove product */
router.post("/remove-product", async (req, res, next) => {
  const result = await userHelpers.removeProduct(req.body);
  res.json(result);
});

/* GET - place order */
router.get("/place-order", verifyLogin, async (req, res, next) => {
  // Access if session exists
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount = null;
  let total;

  let products = await userHelpers.getCartProducts(userId);

  if (user) {
    cartCount = await userHelpers.getCartCount(userId);
  }

  if (cartCount) {
    total = await userHelpers.getTotalAmount(userId);
  }

  res.render("user/place-order", { products, user, cartCount, total });
});

/* POST - place order */
router.post("/place-order", verifyLogin, async (req, res, next) => {
  let user = req.session.user;
  let userId = req.session.user._id;

  let products = await userHelpers.getCartProductList(userId);
  let total = await userHelpers.getTotalAmount(userId);

  const result = await userHelpers.placeOrder(
    req.body,
    products,
    total,
    userId
  );

  const orderId = result.insertedId;

  if (req.body["payment-method"] == "COD") {
    res.json({ codSuccess: true, orderId: orderId });
  } else {
    const result = await userHelpers.generateRazorpay(orderId, total);
    console.log("hi", result);

    res.json(result);
  }
});

router.get("/order-success", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  const orderId = req.query.order_id;

  const order = await userHelpers.getSingleOrder(orderId);
  // console.log("hi", order);

  res.render("user/order-success", {
    user,
    orderId: orderId,
    paymentMethod: order.paymentMethod,
    totalAmount: order.totalAmount,
  });
});

router.get("/orders", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let cartCount;

  if (user) {
    cartCount = await userHelpers.getCartCount(userId);
  }

  let orders = await userHelpers.getUserOrders(userId);
  // console.log(orders);

  for (const order of orders) {
    for (let i = 0; i < order.products.length; i++) {
      const productId = order.products[i].item;
      const product = await dbModule
        .getDb()
        .collection(essentials.PRODUCT_COLLECTION)
        .findOne({ _id: new ObjectId(productId) });
      order.products[i].item = product;
      // console.log(order.products[i]);
    }
  }

  // console.log(orders.products);

  res.render("user/orders", { user, orders, cartCount });
});

router.get("/view-order-products/:id", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  let orderId = req.params.id;

  let products = await userHelpers.getOrderProducts(orderId);
  console.log(products);

  res.render("user/view-order-products", { user, products });
});

router.post("/verify-payment", verifyLogin, async (req, res) => {
  // console.log(req.body);
  const data = req.body;

  const result = await userHelpers.verifyPayment(data);
  const response = await userHelpers.changePaymentStatus(data.order.receipt);

  if (response.modifiedCount > 0) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
