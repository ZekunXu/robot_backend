const mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/robot');

var HardwareMsgSchema = Schema({});

var HardwareMsgDB = mongoose.model('hardwareMsg', HardwareMsgSchema);

/**
 * {
 *   pageStart: int, 
 *   pageSize: int, 
 *   msgType: String
 * }
 */

exports.getAllMsg = (req, res, next) => {

    var data = req.body;


    HardwareMsgDB
        .find(data.msgType ? {msgType: data.msgType} : null) //如果有消息类型，则按照消息类型查询，如果没有则返回全部
        .skip((data.pageStart ? data.pageStart : 0) * (data.pageSize ? data.pageSize : 10))
        .limit( (data.pageSize ? data.pageSize : 10))
        .sort({"_id": -1})
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server"});
        })
}