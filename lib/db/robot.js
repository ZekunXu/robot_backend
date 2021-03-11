var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var RobotInfoSchema = new Schema({

	hardwareID: {type: String, required: true},
	name: {type: String, required: true}, // 给机器人起的名字，不唯一，可随时修改
	hardwareType: {type: String, required: true}, //万维，大白，蓝帄
	version: {type: String, default: "v1.0"}, 
	programCode: {type: String, required: true}, // 机器人所属的项目代码，必填 2021/02/26 增加字段
	updateTime: {type: String, default: Date.now},
	status: {
		status: {type: String, default: "offline"},
		timestamp: {type: String, default: Date.now}
	},
	realtimeStatus: {
		realtimeStatus: {type: String, default: "idleStatus"},
		timestamp: {type: String, default: Date.now}
	},
	location: {
		longitude: {type: Number},
		latitude: {type: Number},
		altitude: {type: Number},
		timestamp: {type: String, default: Date.now}
	},
	power: {
		percentage: {type: Number},
		timestamp: {type: String, default: Date.now}
	}, 
	smoke: {
		coordinate: {type: String},
		timestamp: {type: String, default: Date.now}
	}

});


//导出模型构造函数
module.exports = mongoose.model('robotInfo', RobotInfoSchema);