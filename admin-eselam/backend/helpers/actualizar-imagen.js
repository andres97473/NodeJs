const fs = require("fs");

const Usuario = require("../models/usuario");

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const actualiarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = "";
  //   console.log("Vamos bien");
  switch (tipo) {
    case "usuarios":
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return false;
      }

      pathViejo = `./uploads/usuarios/${usuario.img}`;
      borrarImagen(pathViejo);

      usuario.img = nombreArchivo;
      usuario.save();
      return true;
      break;
  }
};

module.exports = {
  actualiarImagen,
};
