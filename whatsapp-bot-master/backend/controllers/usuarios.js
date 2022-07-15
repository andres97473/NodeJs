const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res = response) => {
  res.json({
    ok: true,
    msg: "Usuarios",
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

    // token
    const token = await generarJWT(usuario._id);

    const usuarioDB = await Usuario.findByIdAndUpdate(usuario._id, { token });

    res.json({
      ok: true,
      msg: "Usuario registrado",
      usuario,
      token,
    });
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
};
