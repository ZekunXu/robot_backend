
const path = require("path");
const UpdateInfoDB = require("../db/update_info.js");

exports.getAppInfo = (req, res, next) => {

    UpdateInfoDB
        .findOne({appName: "运维平台"})
        .then((value)=>{
            if(!value){
                return res.status(200).json({statusCode: "connected", msg: "no data found"});
            }
            return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
        })
        .catch((err)=>{
            return res.status(404).json({ statusCode: "disconnected", msg: "fail to connect to server"});
        })
}

exports.uploadApp = (req, res, next) => {

    if(!req.file){
        return res.status(200).json({statusCode: "connected", msg: "error when storing file"})
    }

    console.dir(req.file);

    const url = "http://www.chenkeai.com:3001\\"+ req.file.path;

    UpdateInfoDB
        .findOneAndUpdate({appName: "运维平台"}, {downloadlink: url}, {new: true})
        .then((value)=>{
            if(!value){
                return res.status(200).json({statusCode: "connected", msg: "fail to store"});
            }

            return res.status(200).json({statusCode: "connected", msg: "success!"});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server"});
        })
}

exports.saveAppData = (req, res, next) => {
    
    var data = req.body;

    UpdateInfoDB(data)
        .save()
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success!"});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server"});
        })
}