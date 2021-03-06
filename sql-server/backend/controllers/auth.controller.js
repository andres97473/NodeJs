const usuarios = require("../exports/usuarios.json");
const { generarJWT } = require("../helpers/jwt");

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

    if (usuario.noEncontrado) {
      return res.status(400).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    if (usuario.contraseña !== contraseña) {
      return res.status(400).json({
        ok: false,
        message: "Contraseña incorrecta",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.codigo);

    res.json({
      ok: true,
      token,
    });
  }
  async renewToken(req, res = response) {
    const codigo = req.codigo;
    // console.log(req.body);
    const usuario = (await usuarios.find(
      (usuario) => usuario.codigo === codigo
    )) || {
      noEncontrado: true,
    };

    const token = await generarJWT(codigo);

    res.json({
      ok: true,
      token,
      usuario,
    });
  }
}

module.exports = new AuthController();
