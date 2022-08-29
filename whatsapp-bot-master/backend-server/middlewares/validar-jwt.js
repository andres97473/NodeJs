const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {
  // leer el token
  const token = req.header("x-token");
  //   console.log(token);
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }

  try {
    // validar token y extraer uid si el token es correcto
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(uid);

    // establecer nueva propiedad en el req con el uid
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};

module.exports = {
  validarJWT,
};
