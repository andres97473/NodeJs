// routes.js
const express = require("express");
const Branch = require("../models/branch");

const router = express.Router();

// Ruta POST para insertar una sucursal
router.post("/branch", async (req, res) => {
  try {
    const newBranch = new Branch(req.body);
    await newBranch.save();
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Ruta Get para obtener todas las sucursales
router.get("/branch", async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Ruta Post para obtener todas las sucursales cercanas a una ubicacion
router.post("/branch/location", async (req, res) => {
  try {
    const { maxDistance, lat, lng } = req.body;
    const branches = await Branch.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          maxDistance: maxDistance,
          distanceField: "distance",
          spherical: true,
        },
      },
      {
        $sort: {
          distance: 1,
        },
      },
    ]);
    res
      .status(200)
      .json({
        msg: `branches close to ${maxDistance} meters found`,
        results: branches.length,
        branches,
      });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
