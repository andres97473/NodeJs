const fs = require("fs");

const Usuario = require("../models/usuario");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

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
    case "medicos":
      const medico = await Medico.findById(id);
      if (!medico) {
        return false;
      }

      pathViejo = `./uploads/medicos/${medico.img}`;
      borrarImagen(pathViejo);

      medico.img = nombreArchivo;
      medico.save();
      return true;

      break;
    case "hospitales":
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        return false;
      }

      pathViejo = `./uploads/hospitales/${hospital.img}`;
      borrarImagen(pathViejo);

      hospital.img = nombreArchivo;
      hospital.save();
      return true;

      break;
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
