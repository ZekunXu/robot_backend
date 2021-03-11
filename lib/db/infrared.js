var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var InfraredSchema = new Schema({
	hardwareID: {type: String, required: true},
	createTime: {type: String, default: Date.now},
	location: {type: String, default: "ifs"},
});


//导出模型构造函数
module.exports = mongoose.model('infrared', InfraredSchema);