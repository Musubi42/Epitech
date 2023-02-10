const { checkUsersExists } = require('../middleware/export.middleware');
const messageController = require("../controllers/message.controller.js");

var router = require("express").Router();

router.post("/", [checkUsersExists], messageController.create);

router.post("/getAll", messageController.getAll);

module.exports = router;