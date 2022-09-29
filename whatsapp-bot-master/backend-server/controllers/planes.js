const { response } = require("express");
const Plan = require("../models/plan");

const getPlanes = async (req, res = response) => {
  try {
    const planes = await Plan.find({ activo: true }).sort({ orden: "asc" });

    res.json({
      ok: true,
      planes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const crearPlan = async (req, res = response) => {
  try {
    const plan = new Plan(req.body);

    // Guardar plan
    const planDB = await plan.save();

    res.json({
      ok: true,
      plan: planDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

module.exports = {
  getPlanes,
  crearPlan,
};
