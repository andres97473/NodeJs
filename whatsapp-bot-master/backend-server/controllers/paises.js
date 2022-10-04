const { response } = require("express");
const Pais = require("../models/pais");

const getPaises = async (req, res = response) => {
  try {
    const paises = await Pais.find().sort({ nombre: "asc" });

    res.json({
      ok: true,
      paises,
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
  getPaises,
};
