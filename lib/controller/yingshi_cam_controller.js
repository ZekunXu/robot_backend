const YingshiCamDB = require("../db/yingshi_cam.js");


/**
 * {
 *   accountName: String,
 *   appKey: String,
 *   appSecret: String, 
 *   accessToken: String, 
 *   expireTime: int
 * }
 */
exports.saveInfo = (req, res, next) => {

    const data = req.body;

    YingshiCamDB(data)
        .save()
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail", err: err});
        })
}


exports.getAllData = (req, res, next) => {
    YingshiCamDB
        .find()
        .then((value)=>{
            if(!value){
                return res.status(200).json({statusCode: "connected", msg: "empty database"});
            }

            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail", err: err});
        })
}