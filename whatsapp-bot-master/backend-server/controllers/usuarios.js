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
      "nombre email role google img cod_pais celular vence disponibles activo codigo created_at update_at"
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
  const { password, email } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // generar codigo unico
    const buscarCodigos = await Usuario.find(
      { codigo: { $ne: null } },
      { codigo: 1, _id: 0 }
    );

    let nCodigos = [];
    let codigoMax = 101;

    if (buscarCodigos.length > 0) {
      buscarCodigos.forEach((element) => {
        const nElement = String(element.codigo).replace("#", "");
        nCodigos.push(Number(nElement));
      });
    }

    if (nCodigos.length > 0) {
      codigoMax = Math.max(...nCodigos) + 1;
    }

    // eliminar propiedades
    delete usuario.vence;
    // definir propiedades por defecto
    usuario.role = "USER_ROLE";
    usuario.disponibles = 0;
    usuario.vence = "1990-01-01";
    // asignar codigo disponible
    usuario.codigo = "#" + codigoMax;

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
    const { password, google, email, vence, disponibles, activo, ...campos } =
      req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    // validar que los usuarios de google no puedan cambiar su correo

    // if (!usuarioDB.google) {
    //   campos.email = email;
    // } else if (usuarioDB.email !== email) {
    //   return res.status(400).json({
    //     ok: false,
    //     msg: "Los usuarios de google no pueden cambiar su correo",
    //   });
    // }

    campos.email = email;
    campos.update_at = new Date();

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
      $set: { password: passwordEncriptado },
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
    return res.status(500).json({
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
    let { disponibles } = req.body;
    const updateDisponibles = await Usuario.updateOne(
      { email },
      { $set: { disponibles, update_at: new Date() } }
    );

    res.json({ ok: true, msg: "Mensajes disponibles actualizados" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioPassword,
  deleteUsuario,
  actualizarFechaVencimiento,
  actualizarMensajesDisponibles,
};
