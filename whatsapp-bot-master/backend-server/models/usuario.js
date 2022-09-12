const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String },
  role: { type: String, required: true, default: "USER_ROLE" },
  google: { type: Boolean, default: false },
  vence: { type: String, default: "1990-01-01" },
  disponibles: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  created_at: { type: Date, required: true, default: Date.now },
  update_at: { type: Date, required: true, default: Date.now },
});

UsuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Usuario", UsuarioSchema);
