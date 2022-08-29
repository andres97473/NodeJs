const { response } = require("express");
const Usuario = require("../models/usuario");
const bcript = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese email",
      });
    }

    // verificar contraseña
    const validarPassword = bcript.compareSync(password, usuarioDB.password);

    if (!validarPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña no es valida",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB._id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

module.exports = {
  login,
};
