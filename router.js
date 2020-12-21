const WebCamController = require("./lib/controller/web_cam_controller.js");

const express = require("express");
const router = express.Router();


router
	.get('/api/robot/webcams', WebCamController.getAllUrls)


module.exports = router;