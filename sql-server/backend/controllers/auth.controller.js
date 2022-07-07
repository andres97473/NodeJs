const usuarios = require("../exports/usuarios.json");

class AuthController {
  async index(req, res) {
    res.json({ message: "Hello auth" });
  }
  async usuarios(req, res) {
    res.json({ usuario });
  }
  async usuarioId(req, res) {
    const { identificacion, contraseña } = req.body;
    const login = String(identificacion).toUpperCase();
    const usuario = usuarios.find(
      (usuario) => usuario.identificacion === login
    ) || { noEncontrado: true };
    res.json({ login, contraseña, usuario });
  }
}

module.exports = new AuthController();
