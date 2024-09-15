const express = require("express");
const router = express.Router();
const productHelpers = require("../helpers/product-helpers");

/* GET Admin page */
router.get("/", (req, res, next) => {
  let products = [
    {
      name: "Earthen Bottle",
      category: "kitchen",
      price: "45",
      image: "/images/img1.jpg",
    },
    {
      name: "Nomad Tumbler",
      category: "kitchen",
      price: "48",
      image: "/images/img2.jpg",
    },
    {
      name: "Paper Refill",
      category: "kitchen",
      price: "50",
      image: "/images/img3.jpg",
    },
    {
      name: "Mechanical Pencil",
      category: "kitchen",
      price: "22",
      image: "/images/img4.jpg",
    },
  ];

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

    // Wait for the product to be added and to get the inserted id
    const data = await productHelpers.addProduct(productData);

    // Extract the inserted id
    const productId = data.insertedId;
    console.log("Inserted product id: " + productId);

    // Move product image to public folder
    productImage.mv("./public/product-images/" + productId + ".jpg", (err) => {
      if (!err) {
        res.render("admin/add-product");
      } else {
        console.error(err);
        res.status(500).send("Failed to upload image");
      }
    });
  } catch (error) {
    console.error(err);
    res.status(500).send("Error adding product");
  }
});

module.exports = router;
