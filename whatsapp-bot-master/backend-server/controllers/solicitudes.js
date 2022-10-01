const { response } = require("express");
const Solicitud = require("../models/solicitud");

const crearSolicitud = async (req, res = response) => {
  try {
    const solicitud = new Solicitud(req.body);

    // Guardar solicitud
    const solicitudDB = await solicitud.save();

    res.json({
      ok: true,
      solicitud: solicitudDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

module.exports = { crearSolicitud };
