const { Schema, model } = require("mongoose");

const MessageSchema = Schema(
  {
    number: { type: String },
    message: { type: String },
    user_id: { type: String },
    created_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "messages" }
);

MessageSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();

  // object.uid = _id;

  return object;
});

module.exports = model("message", MessageSchema);
