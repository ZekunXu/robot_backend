const WebCamController = require("./lib/controller/web_cam_controller.js");
const SessionController = require("./lib/controller/session_controller.js");

const express = require("express");
const router = express.Router();

/**
 * 摄像头相关接口
 */
router
	.get('/api/robot/webcams', WebCamController.getAllUrls)
	.post('/api/robot/webcams', WebCamController.getUrlByHardwareID)
	.post('/api/robot/webcams/save', WebCamController.saveWebCam)
	.post('/api/robot/webcams/delete', WebCamController.deleteWebCam)
	.post('/api/robot/webcams/update', WebCamController.updateUrlByHardwareID)


router
	.post('/api/robot/sessions/save', SessionController.newSession)
	.get('/api/robot/sessions', SessionController.getAllSessions)
	.post('/api/robot/sessions/token', SessionController.getSessionInfoByToken)


module.exports = router;