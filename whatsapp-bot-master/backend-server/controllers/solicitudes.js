const { response } = require("express");
const Solicitud = require("../models/solicitud");

const getSolicitudID = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const [solicitudes, total] = await Promise.all([
      Solicitud.find({ usuario: uid }).sort({ update_at: "desc" }),
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
const enviarSoportePago = async (req, res = response) => {
  const id = req.params.id;
  try {
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una Solicitud por ese id",
      });
    } else if (!solicitud.soporte_pago) {
      return res.status(404).json({
        ok: false,
        msg: "Debe cargar un soporte antes de enviar la solicitud",
      });
    } else {
      // Actualizaciones
      const { estado } = req.body;

      const updateEstado = await Solicitud.findByIdAndUpdate(id, {
        $set: { estado, update_at: new Date() },
      });

      res.json({
        ok: true,
        msg: "Soporte enviado con exito",
        soporte: updateEstado.soporte_pago,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

module.exports = { getSolicitudID, crearSolicitud, enviarSoportePago };
