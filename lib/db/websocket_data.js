var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

mongoose.connect('mongodb://localhost/robot');

var WebSocketDataSchema = new Schema({
	module: {type: String, default: "default"},
	content: {type: String, required: true}, 
});


//导出模型构造函数
module.exports = mongoose.model('robot', WebSocketDataSchema);