const { response } = require("express");

const Notificacion = require("../models/notificacion");
const Usuario = require("../models/usuario");

const getNotificaciones = async (req, res = response) => {
  const uid = req.uid;
  const desde = Number(req.query.desde) || 0;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    } else if (usuario.role === "ADMIN_ROLE") {
      const [notificaciones, novistos, total] = await Promise.all([
        Notificacion.find(
          {},
          "titulo descripcion icono color visto usuario created_at update_at"
        )
          .populate("usuario")
          .skip(desde)
          .limit(5)
          .sort({ update_at: "desc" }),
        Notificacion.find({ visto: false }).count(),
        Notificacion.find({}).count(),
      ]);

      res.json({
        ok: true,
        novistos,
        total,
        notificaciones,
      });
    } else {
      const [notificaciones, novistos, total] = await Promise.all([
        Notificacion.find(
          { usuario: uid },
          "titulo descripcion icono color visto usuario created_at update_at"
        )
          .populate("usuario")
          .skip(desde)
          .limit(5)
          .sort({ update_at: "desc" }),
        Notificacion.find({ usuario: uid, visto: false }).count(),
        Notificacion.find({ usuario: uid }).count(),
      ]);

      res.json({
        ok: true,
        novistos,
        total,
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
  const { titulo, descripcion, icono, color, usuario } = req.body;

  try {
    const usuarioDB = await Usuario.findById(usuario);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const notificacionBody = new Notificacion({
      titulo,
      descripcion,
      icono,
      color,
      usuario,
    });

    // Guardar plan
    const notificacionDB = await notificacionBody.save();

    res.json({
      ok: true,
      notificacion: notificacionDB,
      usuario: usuarioDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const verNotificacion = async (req, res = response) => {
  const id = req.params.id;
  try {
    const notificacion = await Notificacion.findById(id);

    if (!notificacion) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una notificacion con ese id",
      });
    } else {
      const verNotificacion = await Notificacion.findByIdAndUpdate(id, {
        $set: { visto: true },
      });

      res.json({
        ok: true,
        msg: "Notificacion vista",
        notificacion: verNotificacion,
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

module.exports = {
  getNotificaciones,
  crearNotificacion,
  verNotificacion,
};