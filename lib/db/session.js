var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const Token = require("../component/token.js");

mongoose.connect('mongodb://localhost/robot');

var SessionSchema = new Schema({
	username: {type: String, required: true}, 
	password: {type: String, required: true}, 
	version: {type: String, default: "v1.0"}, 
	level: {type: Number, default: 0},
	ban: {type: Boolean, default: false},
	token: {type: String, default: Token.getToken}, // 账号信息唯一标识符
	jgRegisterId: {type: String, default: ""},
	programCode: {type: Array, default: ["IFS"]}
});


//导出模型构造函数
module.exports = mongoose.model('session', SessionSchema);