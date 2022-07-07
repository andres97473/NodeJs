const usuarios = require("../exports/usuarios.json");

class AuthController {
  async index(req, res) {
    res.json({ message: "Hello auth" });
  }
  async usuarios(req, res) {
    res.json({ usuario });
  }
  async usuarioId(req, res) {
    const { id } = req.params;
    const buscar = String(id).toUpperCase();
    const usuario = usuarios.find(
      (usuario) => usuario.identificacion === buscar
    ) || { noEncontrado: true };
    res.json({ buscar, usuario });
  }
}

module.exports = new AuthController();
