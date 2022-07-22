const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res = response) => {
  const [usuarios, total] = await Promise.all([
    Usuario.find({}),
    Usuario.count(),
  ]);

  res.json({
    ok: true,
    total,
    usuarios,
    // se puede obtener del req los parametros q se defina
    // uid: req.uid,
  });
};

const crearUsuarios = async (req, res = response) => {
  //   console.log(req.body);

  const { password, email, num_doc_usr } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const existeIdentificacion = await Usuario.findOne({ num_doc_usr });
    if (existeIdentificacion) {
      return res.status(400).json({
        ok: false,
        msg: "El Numero de documento ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar password
    const salt = bcrypt.genSaltSync();

    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    res.json({
      ok: true,
      msg: "Usuario registrado",
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

const actualizarFechaVencimiento = async (req, res = response) => {
  const { email } = req.params;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (!existeEmail) {
      return res.status(404).json({
        ok: false,
        msg: "El correo no esta registrado",
      });
    }

    // Actualizaciones
    const { vence } = req.body;
    const updateFecha = await Usuario.updateOne(
      { email },
      { $set: { vence, update_at: new Date() } }
    );

    res.json({ ok: true, msg: "Fecha de vencimiento actualizada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

const actualizarMensajesDisponibles = async (req, res = response) => {
  const { email } = req.params;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (!existeEmail) {
      return res.status(404).json({
        ok: false,
        msg: "El correo no esta registrado",
      });
    }

    // Actualizaciones
    const { disponibles } = req.body;
    const updateDisponibles = await Usuario.updateOne(
      { email },
      { $set: { disponibles, update_at: new Date() } }
    );

    res.json({ ok: true, msg: "Mensajes disponibles actualizados" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarFechaVencimiento,
  actualizarMensajesDisponibles,
};
