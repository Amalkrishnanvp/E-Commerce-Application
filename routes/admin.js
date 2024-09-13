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

module.exports = router;
