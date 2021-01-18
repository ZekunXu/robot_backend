const WebCamController = require("./lib/controller/web_cam_controller.js");
const SessionController = require("./lib/controller/session_controller.js");
const InfraredController = require("./lib/controller/infrared_controller.js");
const WebsocketController = require("./lib/controller/websocket_controller.js");
const RobotInfoController = require("./lib/controller/robot_info_controller.js");

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
	.post('/api/robot/sessions/login', SessionController.login)
	.get('/api/robot/sessions', SessionController.getAllSessions)
	.post('/api/robot/sessions/token', SessionController.getSessionInfoByToken)

router
	.post('/api/robot/infrared/save', InfraredController.saveInfraredMsg)
	.post('/api/robot/infrared/count/id', InfraredController.getCountById)

router
	.post('/api/robot/websocket/get/function', WebsocketController.getOfflineMessage)

router
	.post('/api/robot/robotInfo/save', RobotInfoController.saveData)
	.post('/api/robot/robotInfo/update', RobotInfoController.updateRobotStatus)
	.post('/api/robot/robotInfo/smoke', RobotInfoController.updateSmokeInfo)
	.post('/api/robot/robotInfo/location', RobotInfoController.updateRobotLocation)
	.post('/api/robot/robotInfo/get/robotStatus', RobotInfoController.getRobotStatusByID)
	.get('/api/robot/robotInfo/get', RobotInfoController.getAllRobotStatus)

module.exports = router;