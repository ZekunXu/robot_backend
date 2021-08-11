var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const Token = require("../component/token.js");
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var SessionSchema = new Schema({
	nickname: {type: String, default: " "}, //用户的姓名，4/09 添加字段
	username: {type: String, required: true}, 
	password: {type: String, required: true}, 
	version: {type: String, default: "v1.0"}, 
	level: {type: Number, default: 0},
	ban: {type: Boolean, default: false},
	jgRegisterId: {type: String, default: ""},
	programCode: {type: Array, default: ["IFS"]},
	token: {type: String, default: Token.getToken},
	phone: {type: String}, // 4月新版在新创建账户的时候，可以添加手机号。
	accountStatus: {type: Number, default: 0}, //0是未激活，1是已激活，-1是被禁用
	avatar: {type: String, default: "/assets/avatars/default_avatar.jpg"},  //用户头像，4月29日添加。没有添加头像的话是空值
	status: {
		onlineStatus: {type: Number, default:0}, // 0：离线，1：在线
		timestamp: {type: Number, default: Date.now}
	} 
});


//导出模型构造函数
module.exports = mongoose.model('session', SessionSchema);