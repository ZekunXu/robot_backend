var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/robot');

var PersonDataSchema = new Schema({
	hardwareID: {type: String, required: true},
	timestamp: {type: String, default: Date.now},
	param: {
		url: {type: String}, 
		location: {
			longitude: {type: Number},
			latitude: {type: Number},
			altitude: {type: Number},
		}
	}
});


//导出模型构造函数
module.exports = mongoose.model('session', PersonDataSchema);