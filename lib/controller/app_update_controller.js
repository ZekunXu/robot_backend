const fs = require("fs");
const path = require("path");
const UpdateInfoDB = require("../db/update_info.js");
const SessionDB = require("../db/session.js");
const crypto = require('crypto');

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

    const url = "http://www.chenkeai.com:3001/"+ req.file.destination + req.file.filename;

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

/**
 * {
 *   updateInfo: String, 
 *   version: String, 
 *   build: String, 
 *   appName: String
 * }
 */

exports.updateAppInfo = (req, res, next) => {
    var data = req.body;

    UpdateInfoDB
        .findOneAndUpdate({appName: "运维平台"}, {updateInfo: data.updateInfo, version: data.version, build: data.build}, {new: true})
        .then((value)=>{
			return SessionDB.find({}, { jgRegisterId: 1 });
        })
        .then((value)=>{
            var registerIdList = value.map((e) => e.jgRegisterId);
			var title = '有新的版本！';
			var big_text = data.updateAppInfo;
			var alert = "点击前往app更新";
            Notification.pushNotificationByRegisterId({registerIdList: registerIdList, title: title, big_text: big_text, alert: alert, style: 1});
            return res.status(200).json({statusCode: "connected", msg: "success!"});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
        })
}

exports.getAppInfoByXUpdate = (req, res, next) => {

    const filePath = "assets/uploads/app-release.apk";

    var file = fs.statSync(filePath);

    var md5 = getMD5(filePath);

    UpdateInfoDB
        .findOne({appName: "运维平台"})
        .then((value)=>{
            var data = {
                "Code": 0,
                "Msg": "",
                "UpdateStatus": 1,
                "VersionCode": parseInt(value.build),
                "VersionName": value.version,
                "ModifyContent": value.updateInfo,
                "DownloadUrl": value.downloadlink,
                "ApkSize": file.size/(1024*1024),
                "ApkMd5" : md5
            }

            return res.status(200).json({"apkSize": file.size/(1024*1024)});
        })
}


function getMD5 (filePath) {

    const buffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5');
    hash.update(buffer, 'utf8');
    const md5 = hash.digest('hex');

    return md5;
}