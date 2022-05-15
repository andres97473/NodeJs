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

module.exports = {
  getClientes,
};
