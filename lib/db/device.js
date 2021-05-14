var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var DeviceInfoSchema = new Schema({

	hardwareID: {type: String, required: true}, //硬件的ID，硬件的唯一标识
	name: {type: String, required: true}, // 给机器人起的名字，不唯一，可随时修改。
	hardwareType: {type: String, required: true}, // WebCam, Infrared, EDoor
	version: {type: String, default: "v1.0"}, 
	programCode: {type: String}, // 项目唯一的标识
	remark: {type: String, default: ""}, //设备的备注信息
	status: {
		status: {type: String, default: "offline"},
		timestamp: {type: Number, default: Date.now}
	},
	/// used for hardwareType of WebCam. It stores the full type of urls that can reach the stream.
	/// for now, many of the webcams uses m3u8 stream.
	webCamUrl: {
		flv: {type: String},
		m3u8: {type: String}
	},
	location: {
		longitude: {type: Number},
		latitude: {type: Number},
		altitude: {type: Number},
		timestamp: {type: Number, default: Date.now}
	},
	timestamp: {type: Number, default: Date.now}
	
});


//导出模型构造函数
module.exports = mongoose.model('deviceInfo', DeviceInfoSchema);