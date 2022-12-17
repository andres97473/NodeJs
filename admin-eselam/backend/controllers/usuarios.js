const fs = require("fs");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [usuarios, total] = await Promise.all([
    Usuario.find(
      {},
      "num_documento tipo_doc apellido1 apellido2 nombre1 nombre2 celular email img role modulos created_at update_at activo"
    )
      .skip(desde)
      .limit(5),
    Usuario.count(),
  ]);

  res.json({
    ok: true,
    total,
    usuarios,
  });
};

const crearUsuario = async (req, res = response) => {
  // console.log(req.body);
  const { password, email, num_documento } = req.body;

  try {
    // validar email unico
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    // validar num_documento unico
    const existeDocumento = await Usuario.findOne({ num_documento });
    if (existeDocumento) {
      return res.status(400).json({
        ok: false,
        msg: "El numero de documento ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // definir propiedades por defecto
    // usuario.role = "USER_ROLE";

    // Eliminar propiedades enviadas por el usuario
    delete usuario.role;
    delete usuario.modulos;

    // Guardar usuario
    const usuarioDB = await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB._id);

    res.json({
      ok: true,
      token,
      usuario,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // Validar token y comprar si es el usuario correcto

  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    // Actualizaciones
    const { password, email, num_documento, activo, ...campos } = req.body;

    // verificar si ya existe ese email registrado
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    // verificar si ya existe ese documento registrado
    if (usuarioDB.num_documento !== num_documento) {
      const existeDocumento = await Usuario.findOne({ num_documento });
      if (existeDocumento) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese numero de Documento",
        });
      }
    }

    campos.email = email;
    campos.num_documento = num_documento;
    campos.update_at = new Date();

    // eliminar propiedades
    delete campos.modulos;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const actualizarUsuarioPassword = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    // Actualizaciones
    const { password } = req.body;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    const passwordEncriptado = bcrypt.hashSync(password, salt);

    const updatePassword = await Usuario.findByIdAndUpdate(uid, {
      $set: { password: passwordEncriptado, update_at: new Date() },
    });

    res.json({
      ok: true,
      msg: "Contraseña actualizada",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const cambiarEstado = async (req, res = response) => {
  const uid = req.params.id;
  const { estado } = req.body;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    const desactivarUser = await Usuario.findByIdAndUpdate(uid, {
      $set: { activo: estado, update_at: new Date() },
    });

    res.json({
      ok: true,
      msg: "El estado del usuario se ha actualizado por: " + estado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const deleteUsuario = async (req, res) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    if (usuarioDB.img) {
      pathViejo = `./uploads/usuarios/${usuarioDB.img}`;
      borrarImagen(pathViejo);
    }

    res.json({
      ok: true,
      msg: "Usuario eliminado",
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
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioPassword,
  cambiarEstado,
  deleteUsuario,
};
