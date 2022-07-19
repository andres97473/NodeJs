const { Schema, model } = require("mongoose");

const ClienteSchema = Schema(
  {
    num_doc_usr: { type: String },
    tipo_doc: { type: String },
    apellido1: { type: String },
    apellido2: { type: String },
    nombre1: { type: String },
    nombre2: { type: String },
    celular: { type: String },
    estado: { type: String, default: "PENDIENTE" },
    mensaje: { type: String, default: "SIN MENSAJE" },
    longitud: { type: String },
    latitud: { type: String },
    user_id: { type: String },
    created_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "clientes" }
);

ClienteSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();

  // object.uid = _id;

  return object;
});

module.exports = model("cliente", ClienteSchema);
