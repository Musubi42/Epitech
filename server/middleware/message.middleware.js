const UserModel = require("../models/user.model");
const mongoose = require("mongoose");

checkUsersExists = (req, res, next) => {
  UserModel.find({"_id": {$in: [mongoose.Types.ObjectId(req.body.from), mongoose.Types.ObjectId(req.body.to)]}}).then((data) => {
    data.length == 2 ? next() : res.status(200).send({ type: "message", status: "failed", message: "Users not found." });
  });
};

module.exports = { checkUsersExists };