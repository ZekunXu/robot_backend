const fs = require("fs");
const moment = require("moment");
const ImgDataDB = require("../db/img_data.js");
const SessionDB = require("../db/session.js");
const Notification = require("../component/push_notification.js");


exports.saveBase64Img = (req, res, next) => {
    const imgData = req.body.img;

    const dataBuffer = Buffer.from(imgData, "base64");

    const filename = "wwRobot" + moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".png";

    fs.writeFile("./assets/img/" + filename, dataBuffer, (err) => {
        if (err) {
            return res.status(404).json({ msg: "fail", err: err });
        }

        const data = {
            imgType: req.body.imgType,
            url: "http://www.chenkeai.com:3001/assets/img/" + filename,
            reportHardwareId: req.body.reportHardwareId,
            timestamp: req.body.timestamp
        };

        var responseData;

        ImgDataDB(data)
            .save()
            .then((value) => {
                if (!value) {
                    throw 101;
                }
                responseData = value;
                return SessionDB.find({}, { jgRegisterId: 1 });
            })
            .then((value)=>{
                var registerIdList = value.map((e) => e.jgRegisterId);
                var title = data.reportHardwareId + "检测到人脸, 下拉查看";
                var alert = "导航过程中检测到人脸";

                Notification.pushNotificationByRegisterId({registerIdList: registerIdList, title: title, alert: alert, style: 3, big_pic_path: responseData.url});
                return res.status(200).json({ statusCode: "connected", msg: "success", data: responseData });
            })
            .catch((err) => {
                switch(err){
                    case 101:
                        return res.status(200).json({ statusCode: "connected", msg: "null file", data: data });
                        break;
                    default:
                        return res.status(404).json({ statusCode: "disconnected", msg: "fail to store img data" });
                        break;

                }
            })
    });
}


/**
 * 
 * {
 *   imgType: String, 
 *   pageStart: int, 
 *   pageSize: int
 * }
 */
exports.getImgeList = (req, res, next) => {

    const data = req.body;

    if(data.pageStart == null || data.pageSize == null){
        return res.status(200).json({statusCode: "connected", msg: "pageStart or pageSize cannot be null"});
    }
    
    ImgDataDB
        .find({imgType: data.imgType})
        .skip(data.pageStart * data.pageSize)
        .limit(data.pageSize)
        .sort({"_id": -1})
        .then((value)=>{
            if(value.length < 1){
                return res.status(200).json({statusCode: "connected", msg: "out of query or wrong imgType"});
            }

            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server"});
        })

}

exports.updateImgType = (req, res, next) => {
    const imgType = req.body.imgType;

    ImgDataDB
        .updateMany({imgType: imgType}, {imgType: "personImg"})
        .then((value)=>{
            return res.status(200).json({msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({msg: "fail to update", err: err});
        })
}

exports.storeAvatarImg = (req, res, next) => {

    const dataBuffer = Buffer.from(req.body.img, "base64");

    const filename = moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".png";

    fs.writeFile('./assets/avatars/' + filename, dataBuffer, (err)=> {
        if(err){
            return res.status(200).json({code: 201, msg: "存储失败"});
        }

        return res.status(200).json({code: 200, msg: "存储成功", data: '/assets/avatars/' + filename});

    })
}