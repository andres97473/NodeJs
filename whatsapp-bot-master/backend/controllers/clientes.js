const Cliente = require("../models/cliente");

const getClientes = async (req, res) => {
  const [clientes, total] = await Promise.all([
    // Cliente.find({}, "nombre email role google img"),
    Cliente.find(),
    Cliente.count(),
  ]);

  res.json({
    ok: true,
    total,
    clientes,
    // se puede obtener del req los parametros q se defina
    // uid: req.uid,
  });
};

const crearCliente = async (req, res = response) => {
  const {
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
  } = req.body;

  const cliente = new Cliente({
    num_doc_usr,
    tipo_doc,
    apellido1,
    apellido2,
    nombre1,
    nombre2,
    celular,
  });

  try {
    const clienteDB = await Cliente.findOne({ num_doc_usr });
    if (clienteDB) {
      return res.status(404).json({
        ok: false,
        msg: "Ya existe un usuario con ese documento..",
      });
    }
    await cliente.save();

    return res.status(404).json({
      ok: true,
      msg: "Cliente registrado con exito..",
      cliente,
    });

    // console.log(messageDB);
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      ok: false,
      msg: "error inesperado",
      error,
    });
  }
};

const actualizarCliente = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const clienteDB = await Cliente.findById(uid);

    if (!clienteDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un cliente con ese id",
      });
    } else {
      const clienteDoc = await Cliente.findOne({
        num_doc_usr: req.body.num_doc_usr,
      });
      if (clienteDoc) {
        return res.status(404).json({
          ok: false,
          msg: "Ya existe un usuario con ese numero de Documento..",
        });
      }
    }

    // Actualizaciones
    const { ...campos } = req.body;

    campos.update_at = new Date();

    const clienteActualizado = await Cliente.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      cliente: clienteActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarCliente = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const clienteDB = await Cliente.findById(uid);

    if (!clienteDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese id",
      });
    }

    await Cliente.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Cliente Eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getClientes,
  crearCliente,
  actualizarCliente,
  borrarCliente,
};
