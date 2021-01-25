const fs = require("fs");
const moment = require("moment");
const ImgDataDB = require("../db/img_data.js");


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

        ImgDataDB(data)
            .save()
            .then((value) => {
                if (!value) {
                    return res.status(200).json({ statusCode: "connected", msg: "null file", data: value });
                }

                return res.status(200).json({ statusCode: "connected", msg: "success", data: value });
            })
            .catch((err) => {
                return res.status(404).json({ statusCode: "disconnected", msg: "fail to store img data" });
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

    if(!data.pageStart || !data.pageSize){
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
            return res.status(404).json({msg: "fail to uopdate", err: err});
        })
}