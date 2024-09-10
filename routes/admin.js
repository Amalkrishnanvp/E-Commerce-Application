const express = require("express");
const router = express.Router();

/* GET Admin page */
router.get("/", (req, res, next) => {
  res.send("Admin page");
});

module.exports = router;
