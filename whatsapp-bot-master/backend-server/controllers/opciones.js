const { response } = require("express");

const Opcion = require("../models/opcion");
const Usuario = require("../models/usuario");

const getOpciones = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const opciones = await Opcion.find(
      { usuario: uid },
      "codigo opcion respuesta created_at"
    ).sort({ codigo: "asc" });

    res.json({
      ok: true,
      opciones,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};
const crearOpcion = async (req, res = response) => {
  const uid = req.uid;
  const { titulo, descripcion, boton, menu } = req.body;

  try {
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const opcionBody = new Opcion({
      codigo: usuario.codigo,
      titulo,
      descripcion,
      boton,
      menu,
      usuario: uid,
    });

    // Guardar plan
    const opcionDB = await opcionBody.save();

    res.json({
      ok: true,
      opcion: opcionDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs",
    });
  }
};

const deleteOpcion = async (req, res) => {
  const id = req.params.id;

  try {
    const opcionDB = await Opcion.findById(id);

    if (!opcionDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una opcion por ese id",
      });
    }

    await Opcion.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Opcion eliminada",
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
  getOpciones,
  crearOpcion,
  deleteOpcion,
};
