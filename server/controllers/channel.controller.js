const ChannelModel = require("../models/channel.model");
const mongoose = require("mongoose");

exports.create = async (req, res, next) => {
    const Channel = { messages: [{ type: "notification", message: `${req.body.nickname} created channel` }], name: req.body.name, avatar: req.body.avatar, users: { [req.body.uid]: { nickname: req.body.nickname, avatar: req.body.avatar } } };
    ChannelModel.create(Channel).then((data) => {
        req.data = { id: data._id, message: `${req.body.nickname} created channel` };
        req.result = data;
        next();
    }).catch((error) => {
        res.status(400).send(error);
    });
};

exports.join = async (req, res, next) => {
    await ChannelModel.updateMany({ "_id": { $in: [mongoose.Types.ObjectId(req.body.id)] } }, [{
        $set: {
            messages: {
                $concatArrays: [
                    "$messages",
                    [{ type: "notification", message: `${req.body.nickname} joined channel` }]
                ]
            }, users: {
                $mergeObjects: [
                    "$users",
                    { [req.body.uid]: { nickname: req.body.nickname, avatar: req.body.avatar } }
                ]
            }
        }
    }]).then((data) => {
        req.data = { id: req.body.id, message: `${req.body.nickname} joined channel` }
        next()
    });
};

exports.message = async (req, res, next) => {
    await ChannelModel.updateMany({ "_id": { $in: [mongoose.Types.ObjectId(req.body.id)] } }, [{
        $set: {
            messages: {
                $concatArrays: [
                    "$messages",
                    [{ type: "message", uid: req.body.uid, message: req.body.message }]
                ]
            }
        }
    }]).then((data) => {
        req.data = { id: req.body.id, message: req.body.message };
        next();
        // res.status(200).send({ type: "message", status: "updated" });
    });
};

exports.getAllChannels = async (req, res) => {
    await ChannelModel.aggregate([{
        $project: {
            name: "$name",
            avatar: "$avatar",
            message: {
                $last: "$messages"
            }
        }
    }]).then((data) => {
        res.send(data);
    })
};

exports.getAllMessages = async (req, res) => {
    await ChannelModel.findOne({ _id: mongoose.Types.ObjectId(req.body.id) }).then((data) => {
        res.send(data);
    })
};