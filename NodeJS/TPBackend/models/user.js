const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

module.exports = mongoose.model("User", userSchema);
