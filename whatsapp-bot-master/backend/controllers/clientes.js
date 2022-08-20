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
const getClientesToken = async (req, res) => {
  const uid = req.uid;

  try {
    const [clientes, total] = await Promise.all([
      // Cliente.find({}, "nombre email role google img"),
      Cliente.find({ user_id: uid }),
      Cliente.count({ user_id: uid }),
    ]);
    if (!clientes) {
      return res.status(404).json({
        ok: false,
        msg: "no existen clientes para ese usuario",
      });
    }

    res.json({
      ok: true,
      total,
      clientes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
    });
  }
};

const crearCliente = async (req, res = response) => {
  const { num_doc_usr } = req.body;
  console.log(req.body);

  try {
    const existeDocumento = await Cliente.findOne({ num_doc_usr });

    if (existeDocumento) {
      return res.status(400).json({
        ok: false,
        msg: "El documento ya esta registrado",
      });
    }

    const cliente = new Cliente(req.body);

    await cliente.save();

    res.json({
      ok: true,
      msg: "Cliente registrado",
      cliente,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado, revisar logs ",
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
    }
    // else {
    //   const clienteDoc = await Cliente.findOne({
    //     num_doc_usr: req.body.num_doc_usr,
    //   });
    //   if (clienteDoc) {
    //     return res.status(404).json({
    //       ok: false,
    //       msg: "Ya existe un usuario con ese numero de Documento..",
    //     });
    //   }
    // }

    // Actualizaciones
    const { num_doc_usr, ...campos } = req.body;

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
    return res.status(500).json({
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
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getClientes,
  getClientesToken,
  crearCliente,
  actualizarCliente,
  borrarCliente,
};
