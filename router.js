const WebCamController = require("./lib/controller/web_cam_controller.js");
const SessionController = require("./lib/controller/session_controller.js");
const InfraredController = require("./lib/controller/infrared_controller.js");
const WebsocketController = require("./lib/controller/websocket_controller.js");
const RobotInfoController = require("./lib/controller/robot_info_controller.js");
const EnvironmentController = require("./lib/controller/environment_controller.js");
const AppUpdateController = require("./lib/controller/app_update_controller.js");
const ImageController = require("./lib/controller/image_controller.js");
const ProgramController = require("./lib/controller/program_controller.js");
const YingshiCamController = require("./lib/controller/yingshi_cam_controller");
const HardwareMsgController = require("./lib/controller/hardware_msg_controller.js");

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'assets/uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
const upload = multer({ storage: storage });

/**
 * 用来对特定的 api 做访问次数限制。
 * 这个方法是用来限制红外设备的存储。
 */
const apiLimiter = rateLimit({
	windowMs: 2 * 1000, // 2s
	max: 1
  });

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
	.post('/api/robot/sessions/update/jgRegisterId', SessionController.updatejgRegisterId)
	.post('/api/robot/sessions/login', SessionController.login)
	.get('/api/robot/sessions', SessionController.getAllSessions)
	.post('/api/robot/sessions/token', SessionController.getSessionInfoByToken)
	.get('/api/robot/sessions/get/jgRegisterId', SessionController.getAlljgRegisterId)
	.post('/api/robot/sessions/delete', SessionController.deleteSessionByName)
	.post('/api/robot/sessions/update/programCode', SessionController.updateProgramCodeByToken)

router
	.post('/api/robot/infrared/save', apiLimiter, InfraredController.saveInfraredMsg)
	.post('/api/robot/infrared/saveInfo', InfraredController.saveInfraredHardwareInfo)
	.post('/api/robot/infrared/count/id', InfraredController.getCountById)
	.get('/api/robot/infrared/getOne', InfraredController.getLatestMsg)
	.post('/api/robot/infrared/get/count', InfraredController.getMsgByCount)

router
	.post('/api/robot/websocket/get/function', WebsocketController.getOfflineMessage)

router
	.post('/api/robot/robotInfo/save', RobotInfoController.saveData)
	.post('/api/robot/robotInfo/status', RobotInfoController.updateOnlineOfflineById)
	.post('/api/robot/robotInfo/update', RobotInfoController.updateRobotStatus)
	.post('/api/robot/robotInfo/smoke', RobotInfoController.updateSmokeInfo)
	.post('/api/robot/robotInfo/location', RobotInfoController.updateRobotLocation)
	.post('/api/robot/robotInfo/get/robotStatus', RobotInfoController.getRobotStatusByID)
	.post('/api/robot/robotInfo/get', RobotInfoController.getAllRobotStatus)
	.post('/api/robot/robotInfo/update/programCode', RobotInfoController.updateProgramCode)

router
	.post('/api/robot/environment/save', EnvironmentController.saveEnvironmentArea)
	.post('/api/robot/environment/update/temperature', EnvironmentController.updateTemperature)
	.post('/api/robot/environment/update/humidity', EnvironmentController.updateHumidity)

router
	.post('/api/robot/upload/app', upload.single("logo"), AppUpdateController.uploadApp)
	.post('/api/robot/upload/update', AppUpdateController.updateAppInfo)
	.post('/api/robot/upload/save', AppUpdateController.saveAppData)
	.get('/api/robot/download/appInfo', AppUpdateController.getAppInfo)
	.get('/api/robot/download/xUpdate', AppUpdateController.getAppInfoByXUpdate)

router
	.post('/api/robot/img/save',ImageController.saveBase64Img)
	.post('/api/robot/img/update/imgType', ImageController.updateImgType)
	.post('/api/robot/img/get', ImageController.getImgeList)

router
  	.post('/api/robot/program/save', ProgramController.saveProgramInfo)
	.get('/api/robot/program/get', ProgramController.getAllProgramInfo)
	.post('/api/robot/program/update/programCode', ProgramController.updateProgramNameByCode)  
	.post('/api/robot/program/get/programNameByhardwareID', ProgramController.getprogramNameByHardwareId)
	.post('/api/robot/program/get/program', ProgramController.getProgramListByUserToken);
	
router
  	.post('/api/robot/yingshiCam/save', YingshiCamController.saveInfo)
	.get('/api/robot/yingshiCam', YingshiCamController.getAllData)

router
  	.post('/api/robot/hardwareMsg', HardwareMsgController.getAllMsg)


module.exports = router;