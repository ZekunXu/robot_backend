const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const GLOBAL_PARAM = require("../global_param.js");

mongoose.connect(GLOBAL_PARAM.MONGODB_URL);

var HardwareMsgSchema = Schema({});

var HardwareMsgDB = mongoose.model('hardwareMsg', HardwareMsgSchema);
var RobotInfoDB = require("../db/robot.js");

/**
 * {
 *   pageStart: int, 
 *   pageSize: int, 
 *   msgType: String
 *   startDate: int, 
 *   endDate: int
 * }
 */

exports.getAllMsg = (req, res, next) => {

    var data = req.body;

    Promise
        .resolve()
        .then(()=>{

            if((!data.startDate || !data.endDate) && !(!data.startDate && !data.endDate)){
                throw "100";
            }

            if(data.msgType && !data.startDate && !data.endDate){
                var param = {msgType: data.msgType, hardwareType: 'wwRobot'};
            }else if(!data.msgType && data.startDate && data.endDate){
                var param = {timeStamp: {$gte: data.startDate, $lte: data.endDate}, hardwareType: 'wwRobot'};
            }else if(data.msgType && data.startDate && data.endDate){
                var param = {msgType: data.msgType, timeStamp: {$gte: data.startDate, $lte: data.endDate}, hardwareType: 'wwRobot'};
            }

            return HardwareMsgDB
                    .find(param ? param : {hardwareType: 'wwRobot'}) //如果有消息类型，则按照消息类型查询，如果没有则返回全部
                    .skip((data.pageStart ? data.pageStart : 0) * (data.pageSize ? data.pageSize : 10))
                    .limit( (data.pageSize ? data.pageSize : 10))
                    .sort({"_id": -1});
        })
        .then(async function (value){

            // Object.keys(value[0]).forEach((key)=>{
            //     console.log(key, value[0][key]);
            // })

            for(var i=0 ; i < value.length ; i++){
                   
                await RobotInfoDB.findOne({hardwareID: value[i]._doc.hardwareID}).then((res)=>{
                    value[i]._doc.robotName = res.name ? res.name : "名称未知";
                }).catch((err)=>{console.log(err)});

            }

            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            switch(err){
                case "100":
                    return res.status(202).json({statusCode: "connected", msg: "开始日期和结束日期必须同时有"});
                default:
                    return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server"});
            }
        })
}