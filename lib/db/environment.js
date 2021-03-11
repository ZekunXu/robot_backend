var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
const { report } = require('../../router');
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var EnvironmentSchema = new Schema({
    area: {type: String, required: true}, //国金: ifs，乔庄：QiaoZhuang，
    humidity: {
        humidity: {type: Number, default: 0},
        timestamp: {type: String, default: Date.now},
        reportHardwareId: {type: String}
    },
    temperature: {
        temperature: {type: Number, default: 0},
        timestamp: {type: String, default: Date.now},
        reportHardwareId: {type: String}
    }
});


//导出模型构造函数
module.exports = mongoose.model('environment', EnvironmentSchema);