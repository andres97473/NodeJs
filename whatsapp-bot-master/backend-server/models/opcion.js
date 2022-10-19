const { Schema, model } = require("mongoose");

const OpcionSchema = Schema(
  {
    codigo: { type: String, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    boton: { type: String, required: true },
    menu: [
      {
        opcion: { type: String },
        respuesta: { type: String },
      },
    ],
    usuario: { required: true, type: Schema.Types.ObjectId, ref: "Usuario" },
    created_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "opciones" }
);

OpcionSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Opcion", OpcionSchema);
