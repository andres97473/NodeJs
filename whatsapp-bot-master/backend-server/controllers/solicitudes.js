const fs = require("fs");
const { response } = require("express");
const Solicitud = require("../models/solicitud");

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const getSolicitudes = async (req, res = response) => {
  try {
    const [solicitudes, total] = await Promise.all([
      Solicitud.find().sort({ update_at: "desc" }),
      Solicitud.find().count(),
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

const cambiarEstadoSolicitud = async (req, res = response) => {
  const id = req.params.id;

  try {
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una Solicitud por ese id",
      });
    } else {
      // Actualizaciones
      const { estado } = req.body;

      const updateEstado = await Solicitud.findByIdAndUpdate(id, {
        $set: { estado, update_at: new Date() },
      });

      res.json({
        ok: true,
        msg: "Estado de solicitud cambiado",
        solicitud,
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

const cancelarSolicitud = async (req, res = response) => {
  const id = req.params.id;
  try {
    const solicitud = await Solicitud.findById(id);

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una Solicitud por ese id",
      });
    }

    if (solicitud.soporte_pago) {
      pathViejo = `./uploads/solicitudes/${solicitud.soporte_pago}`;
      borrarImagen(pathViejo);
    }
    await Solicitud.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Solicitud eliminada",
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
  getSolicitudes,
  getSolicitudID,
  crearSolicitud,
  enviarSoportePago,
  cambiarEstadoSolicitud,
  cancelarSolicitud,
};
