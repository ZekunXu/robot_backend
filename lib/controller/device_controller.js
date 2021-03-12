const DeviceInfoDB = require("../db/device.js");


/**
 * 
 * {
 *   hardwareID: String, 
 *   name: String, 
 *   hardwareType: String, //EDoor,Infrared, WebCam
 *   programCode: String
 * }
 */
exports.saveDeviceInfo = (req, res, next) => {
    DeviceInfoDB(req.body)
        .save()
        .then((value)=>{
            if(!value){
                return res.status(201).json({statusCode: "connected", msg: "数据存储失败"})
            }

            return res.status(200).json({statusCode: "connected", param: value});
        })
        .catch((err)=>{return res.status(404).json({statusCode: "disconnected", err: err});});
}



/**
 * {
 *   programCode: String
 * }
 */
exports.getDeviceInfo = (req, res, next) => {

    const data = req.body;

    if(data.programCode){
        var param = {programCode: data.programCode};
    }
    
    Promise
        .resolve()
        .then(()=>{
            return DeviceInfoDB.find(param ? param : null)
        })
        .then((value)=>{
            if(!value){
                throw 100;
            }
            return res.stats(200).json({statusCode: "connected", msg: "success", param: value});
        })
        .catch((err)=>{
            switch(err){
                case 100:
                    return res.status(201).json({statusCode: "connected", msg: "没有找到符合条件的设备数据哦"});
                default:
                    return res.status(404).json({statusCode: "disconnected", err: err});
            }
        })
}