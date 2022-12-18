const { response } = require("express");

const Usuario = require("../models/usuario");

const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios] = await Promise.all([Usuario.find({ email: regex })]);

  res.json({
    ok: true,
    usuarios,
  });
};

const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  let data = [];

  switch (tabla) {
    case "usuarios":
      data = await Usuario.find({ email: regex });
      break;
    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla no fue encontrada",
      });
  }
  res.json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  getTodo,
  getDocumentosColeccion,
};
