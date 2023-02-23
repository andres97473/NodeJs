const Usuario = require("../models/usuario");
const moment = require("moment");

const validarNumeroCel = (cel) => {
  const regex = new RegExp(/[A-Z.;: ]/, "g");
  const nCel = cel.toUpperCase().trim().replace(regex, "");
  return nCel;
};

const validarCelulares = (celulares) => {
  let nCel = [];
  for (let cel of celulares) {
    cel = validarNumeroCel(String(cel));
    if (cel.length >= 7) {
      nCel.push(cel);
    }
  }

  return nCel;
};

const validarToken = async (req, res, next) => {
  let { token, celulares } = req.body;

  try {
    celulares = validarCelulares(celulares.split(","));
    req.celulares = celulares;

    const usuario = await Usuario.findById(token);
    let diferencia = 0;
    let nuevoDisponibles = 0;
    let resultadoDisponible = 0;
    let token_vence = "1990-01-01";

    // validar fecha de vencimiento
    if (usuario) {
      token_vence = usuario.vence;
      req.codpais = usuario.cod_pais;

      fechaVencimiento = moment(token_vence);
      fechaActual = moment();

      diferencia = fechaVencimiento.diff(fechaActual, "days");
    }
    // usuario no encontrado
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Token no encontrado",
      });
    } else if (diferencia < 0) {
      if (usuario.disponibles < celulares.length) {
        return res.status(404).json({
          ok: false,
          msg: "No hay suficientes mensajes disponibles y el token ha expirado",
          disponibles: usuario.disponibles,
          token_vence,
        });
      } else {
        const nuevoDispobibles = usuario.disponibles - celulares.length;
        req.disponibles = nuevoDispobibles;
        req.vence = token_vence;

        const updateDisponibles = await Usuario.updateOne(
          { email: usuario.email },
          { $set: { disponibles: nuevoDispobibles, update_at: new Date() } }
        );

        next();
      }
    } else {
      // establecer nueva propiedad en el req con el uid

      req.disponibles = usuario.disponibles;
      req.vence = token_vence;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const validarTokenImg = async (req, res, next) => {
  let { token, celulares } = req.body;

  try {
    celulares = validarCelulares(celulares.split(","));
    req.celulares = celulares;

    const usuario = await Usuario.findById(token);
    let diferencia = 0;
    let nuevoDisponibles = 0;
    let resultadoDisponible = 0;
    let token_vence = "1990-01-01";

    // validar fecha de vencimiento
    if (usuario) {
      token_vence = usuario.vence;
      req.codpais = usuario.cod_pais;

      fechaVencimiento = moment(token_vence);
      fechaActual = moment();

      diferencia = fechaVencimiento.diff(fechaActual, "days");
    }
    // usuario no encontrado
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Token no encontrado",
      });
    } else if (diferencia < 0) {
      if (usuario.disponibles < celulares.length) {
        return res.status(404).json({
          ok: false,
          msg: "No hay suficientes mensajes disponibles y el token ha expirado",
          disponibles: usuario.disponibles,
          token_vence,
        });
      } else {
        const nuevoDispobibles = usuario.disponibles - celulares.length;
        req.disponibles = nuevoDispobibles;
        req.vence = token_vence;

        const updateDisponibles = await Usuario.updateOne(
          { email: usuario.email },
          { $set: { disponibles: nuevoDispobibles, update_at: new Date() } }
        );

        next();
      }
    } else {
      // establecer nueva propiedad en el req con el uid

      req.disponibles = usuario.disponibles;
      req.vence = token_vence;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const validarTokenPrueba = async (req, res, next) => {
  let { token, repeticiones } = req.body;

  const nRepeticiones = Math.round(Number(repeticiones));

  try {
    const usuario = await Usuario.findById(token);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Token no encontrado",
      });
    } else if (!usuario.celular) {
      return res.status(404).json({
        ok: false,
        msg: "No tiene registrado un numero de Whatsapp en su Cuenta",
      });
    } else if (isNaN(nRepeticiones)) {
      return res.status(401).json({
        ok: false,
        msg: "Repeticiones Debe ser un numero entero",
      });
    } else if (nRepeticiones <= 0) {
      return res.status(401).json({
        ok: false,
        msg: "Debe enviar al menos un mensaje",
      });
    } else if (nRepeticiones > 50) {
      return res.status(401).json({
        ok: false,
        msg: "No puede enviar mas de 50 mensajes en esta prueba",
      });
    } else {
      req.numprueba = usuario.celular;
      req.codpais = usuario.cod_pais;
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  validarToken,
  validarTokenPrueba,
  validarTokenImg,
};