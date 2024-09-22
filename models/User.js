const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    type: [
      {
        type: String,
        enum: ["client", "admin"],
      },
    ],
    default: ["client"], 
  },
});

module.exports = mongoose.model("User", userSchema);
