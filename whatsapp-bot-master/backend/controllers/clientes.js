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
  borrarCliente,
};
