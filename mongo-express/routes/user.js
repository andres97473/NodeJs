// routes.js
const express = require("express");
const User = require("../models/user");

const router = express.Router();

// Ruta POST para insertar un usuario
router.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

module.exports = router;
