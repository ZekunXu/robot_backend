const WebCamController = require("./lib/controller/web_cam_controller.js");

const express = require("express");
const router = express.Router();


router
	.get('/api/robot/webcams', WebCamController.getAllUrls)
	.post('/api/robot/webcams', WebCamController.getUrlByHardwareID)
	.post('/api/robot/webcams/save', WebCamController.saveWebCam)
	.post('/api/robot/webcams/delete', WebCamController.deleteWebCam)


module.exports = router;