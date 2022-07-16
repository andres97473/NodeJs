const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    num_doc_usr: { type: String, required: true, unique: true },
    tipo_doc: { type: String },
    apellido1: { type: String },
    apellido2: { type: String },
    nombre1: { type: String },
    nombre2: { type: String },
    celular: { type: String },
    role: { type: String, default: "USER_ROLE" },
    vence: { type: String },
    disponibles: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    created_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "usuarios" }
);

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();

  object.uid = _id;

  return object;
});

module.exports = model("Usuario", UsuarioSchema);
