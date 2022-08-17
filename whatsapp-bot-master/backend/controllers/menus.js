const Usuario = require("../models/usuario");
const Cliente = require("../models/cliente");
const Menu = require("../models/menu");

const getMenus = async (req, res) => {
  const token = req.params.token;
  try {
    const usuario = await Usuario.findOne({ _id: token });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    const respuesta = await Menu.findOne({ user_id: token });

    if (!respuesta) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no tiene un menu registrado",
      });
    }

    res.json({
      ok: true,
      token,
      respuesta,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

const getMenusTelefono = async (req, res) => {
  const celular = req.params.celular;
  var nMenu = [];
  try {
    const clientesCel = await Cliente.find({ celular }, { user_id: 1, _id: 0 });

    if (!clientesCel) {
      return res.status(400).json({
        ok: false,
        msg: "No existe ningun cliente con ese numero de celular",
      });
    }

    for (const iterator of clientesCel) {
      let userMenu = await Usuario.findOne(
        { _id: iterator.user_id },
        { codigo: 1 }
      );
      const menuOptions = await Menu.findOne({ codigo: userMenu.codigo });
      nMenu.push({ codigo: userMenu.codigo, menu: menuOptions.menu });
    }

    res.json({
      ok: true,
      menus: nMenu,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

const crearMenu = async (req, res) => {
  const { codigo, menu } = req.body;

  try {
    const existeMenu = await Menu.findOne({ codigo });

    if (existeMenu) {
      return res.status(400).json({
        ok: false,
        msg: "El codigo ya tiene un menu registrado",
      });
    }

    const existeUsuarioCodigo = await Usuario.findOne({ codigo });

    if (!existeUsuarioCodigo) {
      return res.status(401).json({
        ok: false,
        msg: "No existe un usuario con ese codigo registrado",
      });
    }

    const nMenu = new Menu({ codigo, menu });

    await nMenu.save();

    res.json({
      ok: true,
      menu: nMenu,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

module.exports = {
  getMenus,
  getMenusTelefono,
  crearMenu,
};
