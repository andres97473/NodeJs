const { response } = require("express");

const Mensaje = require("../models/mensaje");

const getMensajes = async (req, res = response) => {
  const uid = req.uid;

  try {
    const [mensajes, total] = await Promise.all([
      Mensaje.find({ usuario: uid }, "celular mensaje tipo created_at"),
      Mensaje.count(),
    ]);

    res.json({
      ok: true,
      total,
      mensajes,
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
  getMensajes,
};
