var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/robot');

var UpdateInfoSchema = new Schema({
    appName: {type: String, required: true},
    updateInfo: {type: String, defualt: ""},
    version: {type: String, required: true},
    build: {type: String, defualt: 1},
    downloadlink: {type: String, default: ""},
    updateTime: {type: String, default: Date.now}
});


//导出模型构造函数
module.exports = mongoose.model('updateInfo', UpdateInfoSchema);