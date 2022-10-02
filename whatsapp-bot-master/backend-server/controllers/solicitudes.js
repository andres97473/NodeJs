const { response } = require("express");
const Solicitud = require("../models/solicitud");

const getSolicitudID = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const [solicitudes, total] = await Promise.all([
      Solicitud.find({ usuario: uid }).sort({ created_at: "desc" }),
      Solicitud.find({ usuario: uid }).count(),
    ]);

    res.json({
      ok: true,
      total,
      solicitudes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

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

module.exports = { getSolicitudID, crearSolicitud };
