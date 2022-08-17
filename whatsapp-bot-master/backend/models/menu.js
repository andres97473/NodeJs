const { Schema, model } = require("mongoose");

const MenuSchema = Schema(
  {
    codigo: { type: String, required: true },
    menu: [{ opcion: { type: String }, respuesta: { type: String } }],
    created_at: { type: Date, required: true, default: Date.now },
    update_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "menus" }
);

MenuSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();

  // object.uid = _id;

  return object;
});

module.exports = model("menu", MenuSchema);
