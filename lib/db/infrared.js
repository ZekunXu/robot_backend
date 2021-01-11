var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

mongoose.connect('mongodb://localhost/robot');

var InfraredSchema = new Schema({
	hardwareID: {type: String, required: true},
	createTime: {type: String, default: moment().format('YYYY-MM-DD HH:mm:ss')},
	location: {type: String, default: "ifs"},
});


//导出模型构造函数
module.exports = mongoose.model('infrared', InfraredSchema);