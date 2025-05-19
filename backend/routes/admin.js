const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const path = require("path");
const adminHelpers = require("../helpers/admin-helpers");

// Function to verify login
const verifyLogin = (req, res, next) => {
  console.log("verify");
  console.log(req.session);
  if (req.session.loggedIn && req.session.user.role === "admin") {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET Admin page */
router.get("/", verifyLogin, async (req, res, next) => {
  console.log("hello");
  // Access if session exists
  let user = req.session.user;
  console.log(user);

  // res.render("admin/view-products", { admin: true, products, user });
  res.render("admin/admin-dashboard", {
    layout: "layouts/adminLayout",
    user,
  });
});

/* GET add product page */
router.get("/add-product", (req, res, next) => {
  // Access if session exists
  let user = req.session.user;
  
  res.render("admin/add-product", {
    layout: "layouts/adminLayout",
    user,
  });
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

    // Build absolute path to frontend product-images folder
    const imageLocation = path.join(
      __dirname,
      "../../frontend/public/product-images",
      productId + ".jpg"
    );

    // Move product image to public folder
    productImage.mv(imageLocation, (err) => {
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
  res.redirect("/admin");

  // Check if files exist and move to folder
  if (req.files.Image) {
    let productImage = req.files.Image;
    productImage.mv("./public/product-images/" + productId + ".jpg");
  }
});

/* GET - Admin profile */
router.get("/logout", (req, res) => {
  // Access if session exists
  let user = req.session.user;

  res.render("admin/admin-logout", {
    user,
    layout: "layouts/adminLayout",
  });
});

/* GET - Admin dashboard */
router.get("/dashboard", (req, res) => {
  // Access if session exists
  let user = req.session.user;

  res.render("admin/admin-dashboard", {
    user,
    layout: "layouts/adminLayout",
  });
});

/* GET - Users list */
router.get("/users", async (req, res) => {
  // Access if session exists
  let user = req.session.user;

  const users = await adminHelpers.getUsers();

  res.render("admin/view-users", {
    user,
    users,
    layout: "layouts/adminLayout",
  });
});

/* GET - Products list */
router.get("/products", async (req, res) => {
  // Access if session exists
  let user = req.session.user;

  // Call function to get all products
  const products = await productHelpers.getAllProducts();

  res.render("admin/view-products", {
    user,
    products,
    layout: "layouts/adminLayout",
  });
});

/* GET - Orders list */
router.get("/orders", async (req, res) => {
  // Access if session exists
  let user = req.session.user;

  const placedOrders = await productHelpers.getPlacedOrders();
  console.log(placedOrders);

  res.render("admin/view-orders", {
    user,
    placedOrders,
    layout: "layouts/adminLayout",
  });
});

router.post("/ship-order", async (req, res) => {
  console.log("post ship order");

  const orderId = req.body.orderId;
  console.log(orderId);

  const result = await productHelpers.shipOrder(orderId);

  if (result.modifiedCount === 0) {
    return res
      .status(404)
      .json({ message: "Order not found or already shipped" });
  }

  res.json({ message: "Order shipped" });
});

module.exports = router;
