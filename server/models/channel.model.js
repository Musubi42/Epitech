const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "No name provided."]
    },
    avatar: String,
    messages: {
        type: [Map]
    },
    users: {
        type: Map,
        of: Map
    }
}, { versionKey: false });

const ChannelModel = mongoose.model("Channel", ChannelSchema);

module.exports = ChannelModel;