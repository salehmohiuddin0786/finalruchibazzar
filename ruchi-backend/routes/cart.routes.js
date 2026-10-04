const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  deleteItem
} = require("../controllers/cart.controller");

router.post("/add", addToCart);

router.get("/:cartId", getCart);

router.put("/update/:id", updateCart);

router.delete("/delete/:id", deleteItem);

module.exports = router;