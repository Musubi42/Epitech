const { getAllUsers, setLastMessage } = require('../middleware/export.middleware');
const channelController = require("../controllers/channel.controller");

var router = require("express").Router();

router.post("/", channelController.create, getAllUsers, setLastMessage);
router.post("/join", channelController.join, getAllUsers, setLastMessage);
router.post("/message", channelController.message, getAllUsers, setLastMessage);
router.post("/allChannels", channelController.getAllChannels);
router.post("/allMessages", channelController.getAllMessages);

module.exports = router;