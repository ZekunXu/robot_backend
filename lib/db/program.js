/**
 * programCode: IFS,QZSQ
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var ProgramSchema = new Schema({
    programName: {type: String, required: true},
    programCode: {type: String, required: true}, // 这是项目的唯一ID
	GPSlocation: {
		longitude: {type: Number},
		latitude: {type: Number},
		altitude: {type: Number},
		timestamp: {type: String, default: Date.now}
	},
});


//导出模型构造函数
module.exports = mongoose.model('programLocation', ProgramSchema);