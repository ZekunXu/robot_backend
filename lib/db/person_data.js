var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var PersonDataSchema = new Schema({
	hardwareID: {type: String, required: true},
	timestamp: {type: String, default: Date.now},
	param: {
		url: {type: String}, 
		location: {
			longitude: {type: Number},
			latitude: {type: Number},
			altitude: {type: Number},
		}
	}
});


//导出模型构造函数
module.exports = mongoose.model('session', PersonDataSchema);