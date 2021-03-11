/*
version: v1.0
Database Name: WebCamUrlDB
Subscription： 用来获取和存储各个种类摄像头的推流地址，方便前端调用。

camType: 
	v1.0: wwRobot，万维机器人
		  hkWebCam，海康威视固定摄像头
		  ldRobot，蓝帄小车

hardwareID: 万维机器人是机器人的ID，海康是摄像头的序列号，蓝帄小车为蓝帄小车的ID
version: 数据库版本，目前在开发阶段，统一为 v1.0
updateTime: 有些摄像头会更新推流地址，所以我们有可能固定一个频率自动获取。默认为创建时间。

 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var WebCamUrlSchema = new Schema({
	camType: {type: String, required: true}, 
	name: {type: String, required: true},
	hardwareID: {type: String, required: true},
	version: {type: String, default: "v1.0"},
	updateTime: {type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')}, 
	param: {
		robotCam: {
			frontUrl: {type: String}, 
			frontRtmp: {type: String},
			backUrl: {type: String},
			backRtmp: {type: String},
			leftUrl: {type: String},
			leftRtmp: {type: String},
			rightUrl: {type: String},
			rightRtmp: {type: String},
		}, 
		haiKangCam: {
			HDFlv: {type: String},
			SDFlv: {type: String},
			HDRtmp: {type: String},
			SDRtmp: {type: String},
		}
	}
});


//导出模型构造函数
module.exports = mongoose.model('webCamUrl', WebCamUrlSchema);
