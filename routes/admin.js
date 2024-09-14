const express = require("express");
const router = express.Router();

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
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  console.log(req.files.Image);
});

module.exports = router;
