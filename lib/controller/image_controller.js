const fs = require("fs");
const moment = require("moment");
const ImgDataDB = require("../db/img_data.js");


exports.saveBase64Img = (req, res, next) => {
    const imgData = req.body.param.url;

    const dataBuffer = Buffer.from(imgData, "base64");

    const filename = "wwRobot" + moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".png";

    fs.writeFile("./assets/img/" + filename, dataBuffer, (err) => {
        if (err) {
            return res.status(404).json({ msg: "fail", err: err });
        }
        
        const data = {
            imgType: req.body.function,
            url: "http://www.chenkeai.com:3001/assets/img/" + filename,
            reportHardwareId: req.body.param.robotId,
            timestamp: req.body.param.timestamp
        };

        ImgDataDB(data)
            .save()
            .then((value)=>{
                if(!value){
                    return res.status(200).json({statusCode: "connected", msg: "null file", data: value});
                }

                return res.status(200).json({statusCode: "connected", msg: "success", data: value});
            })
            .catch((err)=>{
                return res.status(404).json({statusCode: "disconnected", msg: "fail to store img data"});
            })

    });

}