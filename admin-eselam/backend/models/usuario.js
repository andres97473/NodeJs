const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  num_documento: { type: String, required: true, unique: true },
  tipo_doc: { type: String, required: true },
  apellido1: { type: String, required: true },
  apellido2: { type: String },
  nombre1: { type: String, required: true },
  nombre2: { type: String },
  celular: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String },
  role: { type: String, required: true, default: "USER_ROLE" },
  modulos: {
    type: Object,
    default: {
      administracion: {
        tablasGenerales: {
          ver: false,
          consultar: false,
          adicionar: false,
          modificar: false,
          eliminar: false,
          anular: false,
          imprimir: false,
        },
        adminUsuarios: {
          ver: false,
          consultar: false,
          adicionar: false,
          modificar: false,
          eliminar: false,
          anular: false,
          imprimir: false,
        },
      },
    },
  },
  created_at: { type: Date, required: true, default: Date.now },
  update_at: { type: Date, required: true, default: Date.now },
  activo: { type: Boolean, default: true },
});

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Usuario", UsuarioSchema);
