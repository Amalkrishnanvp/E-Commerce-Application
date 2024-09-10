const express = require("express");
const router = express.Router();

/* GET Home page */
router.get("/", (req, res, next) => {
  let products = [
    {
      name: "Earthen Bottle",
      price: "45",
      image: "/images/img1.jpg",
    },
    {
      name: "Nomad Tumbler",
      price: "48",
      image: "/images/img2.jpg",
    },
    {
      name: "Paper Refill",
      price: "50",
      image: "/images/img3.jpg",
    },
    {
      name: "Mechanical Pencil",
      price: "22",
      image: "/images/img4.jpg",
    },
  ];

  res.render("index", {
    title: "E-commerce application",
    products,
    admin: true,
  });
});

module.exports = router;
