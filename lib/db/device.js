var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

mongoose.connect('mongodb://localhost/robot');

var DeviceInfoSchema = new Schema({

	hardwareID: {type: String, required: true}, //硬件的ID，硬件的唯一标识
	name: {type: String, required: true}, // 给机器人起的名字，不唯一，可随时修改。
	hardwareType: {type: String, required: true}, // WebCam, Infrared, EDoor
	version: {type: String, default: "v1.0"}, 
	programCode: {type: String}, // 项目唯一的标识
	status: {
		status: {type: String, default: "offline"},
		timestamp: {type: Number, default: Date.now}
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