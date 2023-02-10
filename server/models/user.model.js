const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, "No nickname provided."],
    unique: true
  },
  password: {
    type: String,
    required: [true, "No password provided."]
  },
  avatar: String,
  messages: {
    type: Map,
    of: [Map]
  }
}, { versionKey: false });

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;