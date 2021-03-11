var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var ImgDataSchema = new Schema({
	imgType: {type: String, required: true},
	url: {type: String, required: true},
	reportHardwareId: {type: String, required: true},
	timestamp: {type: String, default: Date.now}
});


//导出模型构造函数
module.exports = mongoose.model('imgData', ImgDataSchema);