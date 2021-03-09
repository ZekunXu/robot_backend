var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/robot');

var StaredDeviceListSchema = new Schema({
    programCode: {type: String,  required: true},
    userToken: {type: String, required: true},
    starList: {type: Array, default: []},
    timestamp: {type: Number, default: Date.now}
});


//导出模型构造函数
module.exports = mongoose.model('staredDeviceList', StaredDeviceListSchema);