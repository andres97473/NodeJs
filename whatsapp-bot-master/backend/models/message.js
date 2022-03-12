const { Schema, model } = require("mongoose");

const MessageSchema = Schema(
  {
    number: { type: String },
    message: { type: String },
  },
  { collection: "messages" }
);

MessageSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();

  // object.uid = _id;

  return object;
});

module.exports = model("message", MessageSchema);
