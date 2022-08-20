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

  const {
    email,
    password,
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
  } = req.body;

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

    // const existeCodigo = await Usuario.findOne({ codigo });
    // if (existeCodigo) {
    //   return res.status(400).json({
    //     ok: false,
    //     msg: "El Codigo ya esta esta registrado",
    //   });
    // }
    const buscarCodigos = await Usuario.find(
      { codigo: { $ne: null } },
      { codigo: 1, _id: 0 }
    );

    let nCodigos = [];
    let codigoMax = 100;

    if (buscarCodigos.length > 0) {
      buscarCodigos.forEach((element) => {
        const nElement = String(element.codigo).replace("#", "");
        nCodigos.push(Number(nElement));
      });
    }

    if (nCodigos.length > 0) {
      codigoMax = Math.max(...nCodigos) + 1;
    }

    // crear usuario solo con datos permitidos
    const usuario = new Usuario({
      email,
      password,
      num_doc_usr,
      tipo_doc,
      apellido1,
      apellido2,
      nombre1,
      nombre2,
      celular,
      // generar codigo disponible
      codigo: "#" + codigoMax,
    });

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
