var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/robot');

var ImgDataSchema = new Schema({
	imgType: {type: String, required: true},
	url: {type: String, required: true},
	reportHardwareId: {type: String, required: true},
	timestamp: {type: String, default: Date.now}
});


//导出模型构造函数
module.exports = mongoose.model('imgData', ImgDataSchema);