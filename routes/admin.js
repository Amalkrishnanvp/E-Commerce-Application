const express = require("express");
const router = express.Router();

/* GET Admin page */
router.get("/", (req, res, next) => {
  res.render("index", { admin: true });
});

module.exports = router;
