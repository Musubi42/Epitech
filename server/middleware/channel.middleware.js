const UserModel = require("../models/user.model");
const ChannelModel = require("../models/channel.model");
const mongoose = require("mongoose");

getAllUsers = (req, res, next) => {
    ChannelModel.aggregate([{
        $match: {
            _id: { $in: [mongoose.Types.ObjectId(req.data.id)] }
        }
    }, {
        $project: {
            _id: 0,
            name: "$name",
            avatar: "$avatar",
            users: {
                $reduce: {
                    input: { $objectToArray: "$users" },
                    initialValue: [],
                    in: {
                        $concatArrays : ["$$value", ["$$this.k"]]
                    }
                }
            }
        }
    }]).then((data) => {
        req.name = data[0].name;
        req.avatar = data[0].avatar;
        req.users = data[0].users.reduce((accumulator, currentValue) => accumulator.concat([mongoose.Types.ObjectId(currentValue)]), []);
        next();
    })
};

setLastMessage = (req, res) => {
    UserModel.updateMany({ "_id": { $in: req.users } }, [{
        $set: {
            channels: {
                $mergeObjects: [
                    "$channels",
                    { [req.data.id]: { name: req.name, avatar: req.avatar, message: req.data.message } }
                ]
            }
        }
    }]).then((data) => {
        res.status(200).send({ type: "message", status: "updated", data: req.result});
    });
};

module.exports = { setLastMessage, getAllUsers };