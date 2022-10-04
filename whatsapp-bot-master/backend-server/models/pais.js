const { Schema, model } = require("mongoose");

const PaisSchema = Schema(
  {
    nombre: { type: String, required: true },
    codigo: { type: String, required: true },
    isocode: { type: String, required: true },
    predeterminado: { type: Boolean, default: false },
  },
  { collection: "paises" }
);

PaisSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Pais", PaisSchema);
