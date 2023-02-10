const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  const User = { nickname: req.body.nickname, password: req.body.password != undefined ? bcrypt.hashSync(req.body.password, 8) : undefined, avatar: req.avatar };
  UserModel.create(User).then((data) => {
    res.status(200).send({ type: "registered", status: "success", message: { uid: data.id, avatar: data.avatar, nickname: data.nickname } });
  }).catch((error) => {
    res.status(200).send({ type: "registered", status: "failed", message: error.code === 11000 ? "Nickname already used." : Object.assign({}, ...Object.entries(error.errors).map((value) => ({ [value[0]]: value[1].message }))) });
  });
};

exports.registerAnonymous = async (req, res) => {
  const User = { nickname: `User${Math.floor(Math.random() * 1000)}`, password: bcrypt.hashSync((Math.random() + 1).toString(36).substring(7), 8), avatar: req.avatar };
  UserModel.create(User).then((data) => {
    res.status(200).send({ type: "registered", status: "success", message: { uid: data.id, avatar: data.avatar, nickname: data.nickname } });
  }).catch((error) => {
    res.status(200).send({ type: "registered", status: "failed", message: error.code === 11000 ? "Nickname already used." : Object.assign({}, ...Object.entries(error.errors).map((value) => ({ [value[0]]: value[1].message }))) });
  });
};

exports.signin = async (req, res, next) => {
  UserModel.findOne({ nickname: req.body.nickname }).then((data) => {
    if (data != null) {
      const passwordIsValid = req.body.password != undefined ? bcrypt.compareSync(req.body.password, data.password) : false;
      if (passwordIsValid) {
        req.data = { type: "signin", status: "success", message: { uid: data.id, avatar: data.avatar, nickname: data.nickname } };
        next();
      } else {
        res.status(200).send({ type: "signin", status: "failed", message: "Invalid password." });
      }
    } else {
      res.status(200).send({ type: "signin", status: "failed", message: "No user found." });
    }
  })
};

exports.getNicknameAvatar = async (req, res) => {
  UserModel.aggregate([{
    $match: {
      _id: { $in: Object.keys(req.data.message.lastMessages).map((value) => mongoose.Types.ObjectId(value)) }
    }
  }, {
    $project: {
      _id: 0,
      id: {
        $toString: "$_id"
      },
      nickname: "$nickname",
      avatar: "$avatar"
    }
  }]).then((data) => {
    data.map((item) => Object.assign(req.data.message.lastMessages[item.id], { nickname: item.nickname, avatar: item.avatar }));
    res.status(200).send(req.data);
  })
};