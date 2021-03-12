const StaredDeviceListDB = require("../db/stared_device_list.js");



exports.saveData = (req, res, next) => {
    StaredDeviceListDB(req.body)
        .save()
        .then((value)=>{
            if(!value){throw 100};

            return res.status(200).json({statusCode: "connected", param: value})
        })
        .catch((err)=>{
            switch(err){
                case 100:
                    return res.status(404).json({statusCode: "connected", msg: "存储数据失败"});
                default:
                    return res.status(404).json({statusCode: "disconnected", err: err});
            }
        })
}

exports.getInfoByToken = (req, res, next) => {

    const data = req.body;

    StaredDeviceListDB
        .findOne({token: data.token})
        .then((value)=>{
            return res.status(200).json({param: value});
        })
        .catch((err)=>{return res.status(404).json({err: err})})

}