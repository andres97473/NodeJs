const { response } = require("express");
const Usuario = require("../models/usuario");
const bcript = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

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
      menu: getMenuFrontEnd(usuarioDB.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      (usuario = usuarioDB), (usuario.google = true);
    }

    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario._id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuario.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Token de google no es corecto",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // Generar el TOKEN - JWT
  const token = await generarJWT(uid);
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario,
    menu: getMenuFrontEnd(usuario.role),
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
