const { Schema, model } = require("mongoose");

const PlanSchema = Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    valor: { type: Number, required: true },
    tipo: { type: Number, required: true },
    vence: { type: Number },
    disponibles: { type: Number },
    popular: { type: Boolean, default: false },
    orden: { type: Number, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    activo: { type: Boolean, default: true },
  },
  { collection: "planes" }
);

PlanSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Plan", PlanSchema);
