const mongoose = require("mongoose");
const UserModel = require("../models/user.model");

exports.create = async (req, res) => {
  await UserModel.updateMany({ "_id": { $in: [mongoose.Types.ObjectId(req.body.from), mongoose.Types.ObjectId(req.body.to)] } }, [{
    $set: {
      messages: {
        $mergeObjects: [
          "$messages",
          {
            $cond: {
              if: {
                $eq: [{ $toString: "$_id" }, req.body.from]
              },
              then: {
                $arrayToObject: [
                  [{
                    "k": req.body.to, "v": {
                      $cond: {
                        if: {
                          $isArray: `$messages.${req.body.to}`
                        },
                        then: {
                          $concatArrays: [
                            `$messages.${req.body.to}`,
                            [{ type: "sent", message: req.body.message }]
                          ]
                        },
                        else: {
                          $concatArrays: [
                            [{ type: "sent", message: req.body.message }]
                          ]
                        }
                      }
                    }
                  }]
                ]
              },
              else: {
                $arrayToObject: [
                  [{
                    "k": req.body.from, "v": {
                      $cond: {
                        if: {
                          $isArray: `$messages.${req.body.from}`
                        },
                        then: {
                          $concatArrays: [
                            `$messages.${req.body.from}`,
                            [{ type: "recieved", message: req.body.message }]
                          ]
                        },
                        else: {
                          $concatArrays: [
                            [{ type: "recieved", message: req.body.message }]
                          ]
                        }
                      }
                    }
                  }]
                ]
              }
            }
          }
        ]
      }
    }
  }]).then((data) => {
    res.status(200).send({ type: "message", status: "updated" });
  });
};

exports.getLast = async (req, res, next) => {
  UserModel.aggregate([{
    $match: {
      _id: { $in: [mongoose.Types.ObjectId(req.data.message.uid)] }
    }
  }, {
    $project: {
      _id: 0,
      messages: {
        $reduce: {
          input: { $objectToArray: "$messages" },
          initialValue: {},
          in: {
            $mergeObjects: [
              "$$value",
              {
                $arrayToObject: [
                  [{
                    "k": "$$this.k", "v": {
                      $last: "$$this.v"
                    }
                  }]
                ]
              }
            ]
          }
        }
      }
    }
  }]).then((data) => {
    if (data[0].messages == null) {
      res.status(200).send(req.data);
    } else {
      req.data.message["lastMessages"] = data[0].messages;
      next();
    }
  })
};

exports.getAll = async (req, res) => {
  UserModel.aggregate([{
    $match: {
      _id: { $in: [mongoose.Types.ObjectId(req.body.from)] }
    }
  }, {
    $project: {
      _id: 0,
      messages: `$messages.${req.body.to}`
    }
  }]).then((data) => {
    res.status(200).send({ type: "messages", status: "success", messages: data[0].messages });
  })
};