var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var WebSocketDataSchema = new Schema({
	module: {type: String, default: "default"},
	content: {type: String, required: true}, 
});


//导出模型构造函数
module.exports = mongoose.model('robot', WebSocketDataSchema);