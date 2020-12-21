var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

mongoose.connect('mongodb://localhost/robot');

var webCamUrlSchema = new Schema({
	_id: Schema.Types.ObjectId
	camType: {type: String, required: true}, 
	mainUrl: {
		url: {type: String, required: true},
	}, 
});


//导出模型构造函数
module.exports = mongoose.model('webCamUrl', WebCamUrlSchema);
