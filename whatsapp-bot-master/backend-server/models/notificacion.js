const { Schema, model } = require("mongoose");

const NotificacionSchema = Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    icono: { type: String },
    color: { type: String },
    visto: { type: Boolean, default: false },
    usuario: { required: true, type: Schema.Types.ObjectId, ref: "Usuario" },
    created_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "notificaciones" }
);

NotificacionSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Notificacion", NotificacionSchema);
