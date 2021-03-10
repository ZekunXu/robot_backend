const RobotInfoDB = require("../db/robot.js");
const StaredDeviceListDB = require("../db/stared_device_list");
const DeviceInfoDB = require("../db/device.js");

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

    Promise
        .resolve()
        .then(async function () {
            if(type != "Stars"){
                return DeviceInfoDB.find({programCode: req.body.programCode, type: req.body.type})
            }
            // 如果是常用设备列表，则先访问star数据库获取相关hardwreID的list,便利，获取每个device的信息。
            // 最后返回信息。
            var resList = [];
            await StaredDeviceListDB
                    .findOne({token: req.body.token, programCode: req.body.programCode})
                    .then(async function (value) {
                        const starList = value.starList;
                        for(var i=0 ; i<starList.length ; i++){
                            await DeviceInfoDB
                                    .findOne({hardwareID: resList[i]})
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
                                    .catch((err)=>{throw err;})
                        }
                    })
                    .catch((err)=>{
                        throw 100;
                    })
            return resList;

        })
        .then((value)=>{
            res.status(200).json({statusCode: "connected", msg: "success", param: value})
        })
        .catch((err)=>{
            switch(err){
                case 100:
                    return res.status(404).json({statusCode: "disconnected", msg: "获取常用设备列表信息时候出现错误", err: err});
                default:
                    return res.status(404).json({statusCode: "disconnected", err: err});
            }
        })


}