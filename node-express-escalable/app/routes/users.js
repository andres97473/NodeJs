const express = require("express");
const router = express.Router();
const checkOrigin = require("../middleware/origin");
const {
  getItems,
  getItemId,
  createItem,
  updateItem,
  deleteItem,
} = require("../controller/users");

router.get("/", getItems);

router.get("/:id", getItemId);

router.post("/", checkOrigin, createItem);

router.patch("/:id", updateItem);

router.delete("/:id", deleteItem);

module.exports = router;
