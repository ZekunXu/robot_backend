const RobotInfoDB = require("../db/robot.js");
const StaredDeviceListDB = require("../db/stared_device_list.js");
const DeviceInfoDB = require("../db/device.js");
const SessionDB = require("../db/session.js");

/**
 * 固定设备页首页的接口。
 * {
 *   programCode: String, 
 *   token: String, 
 *   type: String, //EDoor, Infrared... Stars(用户添加的常用设备)
 * }
 */

exports.getDeviceList = (req, res, next) => {

    const type = req.body.type;
    const rawData = req.body;

    Promise
        .resolve()
        .then(async function () {
            if(type != "Stars"){
                return DeviceInfoDB.find({programCode: req.body.programCode, hardwareType: req.body.type})
            }
            // 如果是常用设备列表，则先访问star数据库获取相关hardwreID的list,便利，获取每个device的信息。
            // 最后返回信息。
            var resList = [];
            await StaredDeviceListDB
                    .findOne({userToken: rawData.token, programCode: rawData.programCode})
                    .then(async function (value) {
                        if(!value){
                        
                            const newStarListData = await StaredDeviceListDB({userToken: rawData.token, programCode: rawData.programCode}).save();

                            resList = newStarListData.starList;
                        }else if(value.starList.length == 0){
                            resList = [];
                        }else {
                            const starList = value.starList;
                            for(var i=0 ; i<starList.length ; i++){
                                await DeviceInfoDB
                                        .findOne({hardwareID: starList[i]})
                                        .then((value)=>{
                                            resList.push({
                                                hardwareType: value.hardwareType,
                                                status: {
                                                    status: value.status.status,
                                                    timestamp: value.status.timestamp,
                                                },
                                                hardwareID: value.hardwareID,
                                                name: value.name
                                            });
                                        })
                                        .catch((err)=>{throw 103;})
                            }
                        }
                    })
                    .catch((err)=>{
                        throw err;
                    })
            return resList;

        })
        .then((value)=>{
            res.status(200).json({statusCode: "connected", msg: "success", param: value})
        })
        .catch((err)=>{
            switch(err){
                case 101:
                    return res.status(201).json({statusCode: "connected", msg: "账户下无常用设备", param: {}})
                case 100:
                    return res.status(404).json({statusCode: "disconnected", msg: "获取常用设备列表信息时候出现错误", err: err});
                case 200:
                    return res.status(404).json({statusCode: "disconnected", msg: "获取常用设备信息的时候出现信息错误。"})
                default:
                    return res.status(404).json({statusCode: "disconnected", err: err, data: null});
            }
        })


}