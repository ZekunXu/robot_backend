const fs = require("fs");
const moment = require("moment");
const ImgDataDB = require("../db/img_data.js");
const SessionDB = require("../db/session.js");
const Notification = require("../component/push_notification.js");
const axios = require('axios');
const GLOBAL_PARAM = require('../global_param.js');
const multer = require('multer');

/**
 * 此接口用来接受上报的机器人识别的图片数据，并将数据存储到本地
 * 存储之后，会根据照片的数据，按照用户的 level 和 programCode 来进行筛选
 * 并发送推送通知。
 */
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
            url: "/assets/img/" + filename,
            reportHardwareId: req.body.reportHardwareId,
            timestamp: req.body.timestamp
        };

        var imgFile;

        ImgDataDB(data)
            .save()
            .then(async (value) => {
                if (!value) {
                    throw 101;
                }
                imgFile = value._doc;

                //存储成功的话，给 hardwareMsg 发送消息，用来存储 faceReport 消息
                await axios.post(
                    "http://localhost:3000/api/hardwareMsg/insert", 
                    {
                        hardwareID: value._doc.reportHardwareId,
                        hardwareType: "wwRobot",
                        msgType: "faceReport",
                        param: {
                            _id: value._doc._id
                        }
                    },
                    {
                        headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
                    }
                );

                // 过滤发通知的账户。需要是账户等级为管理员和运营者，并且为 ifs 账户的，才会发送通知。
                return SessionDB.find({level: {$lte: 1}, programCode: {$in: ["IFS"]}}, { jgRegisterId: 1 });
            })
            .then((value)=>{
                let registerIdList = value.map((e) => e.jgRegisterId);

                console.log(registerIdList);

                let title = data.reportHardwareId + "检测到人脸, 下拉查看";
                let alert = "导航过程中检测到人脸";
                //添加点击通知时跳转传入的信息
                let extras = {
                    page: "PeopleDetailsPage",
                    id: imgFile._id
                }


                //发起发送通知的请求。
                Notification.pushNotificationByRegisterId({registerIdList: registerIdList, title: title, alert: alert, style: 3, big_pic_path: imgFile.url, extras: extras});
                return res.status(200).json({ statusCode: "connected", msg: "success", data: imgFile });
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

exports.storeOrderIMImg = (req, res, next) => {

    const dataBuffer = Buffer.from(req.body.img, "base64");

    const filename = moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".png";

    fs.writeFile('./assets/order/imImg/' + filename, dataBuffer, (err)=> {
        if(err){
            return res.status(200).json({code: 201, msg: "存储失败"});
        }

        return res.status(200).json({code: 200, msg: "存储成功", data: '/assets/order/imImg/' + filename});

    })
}

exports.storeOrderIMAudio = (req, res, next) => {

    const dataBuffer = Buffer.from(req.body.audio, "base64");

    const filename = moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".mp3";

    fs.writeFile('./assets/order/imAudio/' + filename, dataBuffer, (err)=> {
        if(err){
            return res.status(200).json({code: 201, msg: "存储失败"});
        }

        return res.status(200).json({code: 200, msg: "存储成功", data: '/assets/order/imAudio/' + filename});

    })
}

exports.storeOrderIMVideo = (req, res, next) => {

    const dataBuffer = Buffer.from(req.body.video, "base64");

    const filename = "video_" + moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".mp4";

    fs.writeFile('./assets/order/imVideo/' + filename, dataBuffer, (err)=> {
        if(err){
            return res.status(200).json({code: 201, msg: "存储失败"});
        }

        return res.status(200).json({code: 200, msg: "存储成功", data: '/assets/order/imVideo/' + filename});

    })
}



/**
 * 此接口目前用来处理app端工单上传上来的媒体数据。
 * 1. 通过 multer 直接将数据存储到对应的文件夹。
 * 2. 存储成功后，会返回将信息信息发送给 3000 service 进行存储。
 * 3. 接收到存储成功的消息之后。返回成功参数。
 */
exports.saveFormData = async (req, res, next) => {

    if(!req.body.token || !req.body.orderId) {
        return res.status(401).json({code: 401, msg: "token 或 orderId 参数不能为空", data: null});
    }

    let cover_img_url;

    if(req.body.videoCoverImg){
        cover_img_url = await storeImg("/assets/order/videoCover/", 'img', req.body.videoCoverImg);
    }


    let params = {
        IMType: parseInt(req.body.IMType),
        info: `/${req.file.destination}${req.file.filename}`,
        orderId: req.body.orderId,
        token: req.body.token,
        videoCoverImg: cover_img_url ? cover_img_url : ""
    }

    const insert_data = await axios.post(
        "http://localhost:3000/api/orderIMDB/insert",
        params,
        {
            headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
        }
    );

    console.log(insert_data.data);

    if (!insert_data) {
        return res.status(201).json({code: 201, msg: "im 数据保存失败", data: null});
    }


    return res.status(200).json({code:200, msg: `保存成功`, data: insert_data.data});

}


async function storeImg (path, type, file) {

    const dataBuffer = Buffer.from(file, "base64");

    let filename;

    switch(type) {
        case 'img':
            filename = "img_" + moment().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 10000) + ".png";
            break;
    }

    const fsPromise = fs.promises;

    try{
        await fsPromise.writeFile('.' + path + filename, dataBuffer);

        return path + filename;

    }catch(err){
        console.log(err);

        return "";
    }

}