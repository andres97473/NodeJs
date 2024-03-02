const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  country: String,
  country_code: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
    is_location_exact: Boolean,
  },
});

addressSchema.index({ location: "2dsphere" });

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  address: addressSchema,
});

const User = mongoose.model("Branch", branchSchema);

module.exports = User;
