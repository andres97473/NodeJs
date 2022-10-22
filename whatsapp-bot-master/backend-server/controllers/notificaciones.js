const { response } = require("express");

const Notificacion = require("../models/notificacion");
const Usuario = require("../models/usuario");

const getNotificaciones = async (req, res = response) => {
  const uid = req.uid;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    } else if (usuario.role === "ADMIN_ROLE") {
      const [notificaciones, novistos] = await Promise.all([
        Notificacion.find(
          {},
          "titulo descripcion icono visto usuario created_at update_at"
        ).sort({ update_at: "asc" }),
        Notificacion.find({ visto: false }).count(),
      ]);

      res.json({
        ok: true,
        novistos,
        notificaciones,
      });
    } else {
      const [notificaciones, novistos] = await Promise.all([
        Notificacion.find(
          { usuario: uid },
          "titulo descripcion icono visto usuario created_at update_at"
        ).sort({ update_at: "asc" }),
        Notificacion.find({ usuario: uid, visto: false }).count(),
      ]);

      res.json({
        ok: true,
        novistos,
        notificaciones,
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

const crearNotificacion = async (req, res = response) => {
  const uid = req.uid;
  const { titulo, descripcion, icono } = req.body;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const notificacionBody = new Notificacion({
      titulo,
      descripcion,
      icono,
      usuario: uid,
    });

    // Guardar plan
    const notificacionDB = await notificacionBody.save();

    res.json({
      ok: true,
      notificacion: notificacionDB,
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
  getNotificaciones,
  crearNotificacion,
};
