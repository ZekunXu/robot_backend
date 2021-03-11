/**
 * 本数据库用来存储和萤石摄像头相关的数据信息。
 * accountName: 账户名，可更改
 * appKey: 从萤石开发者后台获取
 * appSecret: 从萤石开发者后台获取
 * accessToken: 通过 api 获取，有有效期
 * expireTime: 通过 api 获取，为 accessToken 的有效期
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var YingshiCamSchema = new Schema({
    accountName: {type: String, required: true},
    appKey: {type: String, required: true},
    appSecret: {type: String, required: true},
    accessToken: {type: String},
    expireTime: {type: Number,}
});


//导出模型构造函数
module.exports = mongoose.model('yingshiCam', YingshiCamSchema);