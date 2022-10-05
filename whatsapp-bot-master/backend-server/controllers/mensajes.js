const { response } = require("express");

const Mensaje = require("../models/mensaje");

const getMensajes = async (req, res = response) => {
  const uid = req.uid;

  try {
    const [mensajes, total, archivo, prueba, mensaje] = await Promise.all([
      Mensaje.find(
        { usuario: uid },
        "cod_pais celular mensaje tipo activo created_at"
      ).sort({ created_at: "desc" }),
      Mensaje.find({ usuario: uid }).count(),
      Mensaje.find({ usuario: uid, tipo: "ARCHIVO" }).count(),
      Mensaje.find({ usuario: uid, tipo: "PRUEBA" }).count(),
      Mensaje.find({ usuario: uid, tipo: "MENSAJE" }).count(),
    ]);

    res.json({
      ok: true,
      total,
      archivo,
      prueba,
      mensaje,
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
