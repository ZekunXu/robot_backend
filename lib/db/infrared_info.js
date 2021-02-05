var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

mongoose.connect('mongodb://localhost/robot');

var InfraredInfoSchema = new Schema({
	hardwareID: {type: String, required: true},
	createTime: {type: String, default: Date.now},
	location: {type: String, default: "ifs"},
	status: {type: String, default: "offline"},
	name: {type: String, default: ""},
});


//导出模型构造函数
module.exports = mongoose.model('infraredInfo', InfraredInfoSchema);