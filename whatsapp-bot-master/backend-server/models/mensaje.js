const { Schema, model } = require("mongoose");

const MensajeSchema = Schema(
  {
    celular: { type: String, required: true },
    mensaje: { type: String, required: true },
    tipo: { type: String },
    usuario: { required: true, type: Schema.Types.ObjectId, ref: "Usuario" },
    created_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "mensajes" }
);

MensajeSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Mensaje", MensajeSchema);