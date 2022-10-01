const { Schema, model } = require("mongoose");

const SolicitudSchema = Schema(
  {
    usuario: { required: true, type: Schema.Types.ObjectId, ref: "Usuario" },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    valor: { type: Number, required: true },
    tipo: { type: Number, required: true },
    estado: { type: String, default: "PENDIENTE" },
    vence: { type: Number },
    disponibles: { type: Number },
    soporte_pago: { type: String },
    usr_aprueba: { type: Schema.Types.ObjectId, ref: "Usuario" },
    created_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "solicitudes" }
);

SolicitudSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Solicitud", SolicitudSchema);
