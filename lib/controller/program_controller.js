const ProgramDB = require("../db/program.js");
const RobotInfoDB = require("../db/robot.js");
const SessionDB = require("../db/session.js");


/**
 * 
 * {
 *   programName: String, 
 *   programCode: String, IFS/QZSQ
 *   GPSLocation: {
 *                  longitude: double, 
 *                  latitude: double, 
 *                  altitude: double,
 *                }
 * }
 */

exports.saveProgramInfo = (req, res, next) => {

    ProgramDB(req.body)
    .save()
    .then((value)=>{
        return res.status(200).json({statusCode: "connected", msg: "success", data: value});
    })
    .catch((err)=>{
        return res.status(404).json({statusCode: "disconnected", err: err});
    })

}

exports.getAllProgramInfo = (req, res, next) => {

    ProgramDB
        .find()
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            return res.status(404).json({statusCode: "disconnected", err: err});
        })
}

/**
 * {
 *   programName: String, 
 *   programCode: String
 * }
 */

exports.updateProgramNameByCode = (req, res, next) => {
    const data = req.body;

    ProgramDB
        .findOneAndUpdate({programCode: data.programCode}, {programName: data.programName}, {new: true})
        .then((value)=>{
            if(!value){
                return res.status(201).json({statusCode: "connected", msg: "no such program code"});
            }
            return res.status(200).json({statusCode: "connected", msg: "success", data: value});
        })
        .catch((err)=>{
            res.status(404).json({statusCode: "disconnected", msg: "fail to connect to server", err: err});
        })
}

/**
 * 请求格式
 * {
 *   hardwareID: String
 * }
 * 
 * 回复格式
 * {
 *   statusCode: String, 
 *   msg: String, 
 *   data: {
 *         programName: String
 *         robotName: String
 *       }
 * }
 */

exports.getprogramNameByHardwareId = (req, res, next) => {

    const data = req.body;

    var robotName;

    Promise
        .resolve()
        .then(()=>{
            return RobotInfoDB.findOne({hardwareID: data.hardwareID});
        })
        .then((value)=>{
            if(!value){
                throw "100";
            }

            console.log(value);

            robotName = value.name;

            return ProgramDB.findOne({programCode: value.programCode});
        })
        .then((value)=>{
            return res.status(200).json({statusCode: "connected", msg: "success", data: {programName: value.programName, robotName: robotName}});
        })
        .catch((err)=>{
            switch(err){
                case "100":
                    return res.status(201).json({statusCode: "connected", msg: "invalid hardwareID"});
                default:
                    return res.status(404).json({statusCode: "disconnected", msg: "fail to connect tto server", err: err});
            }
        })
}



/**
 * 这是首页账户在切换项目时，请求项目列表的接口
 * @req token
 * 
 * 
 */

exports.getProgramListByUserToken = (req, res, next) => {

    const token = req.body.token;

    var resData = [];

    Promise
        .resolve()
        .then(()=>{
            /**
             * 第一步，我们根据用户的 token，获取账户下 programList 的数据
             */

            return SessionDB.findOne({token: token});

        })
        .then(async function (value) {
            if(!value){
                throw "100"; 
            }

            /**
             *  programCode 是一个 array 的形式，我们通过循环 array 的方式，获取所有的项目信息。
             */

            const programCodeList = value.programCode;

            for(var i=0 ; i<programCodeList.length ; i++){
                await ProgramDB.findOne({programCode: programCodeList[i]})
                        .then((value)=>{
                            /**
                             * 1. 想获取的项目信息，存储到返回的列表当中
                             * 2. 我们需要接着去 robotInfo 数据库，获取和项目相关的机器人和摄像头数量
                             */
                            resData.push({GPSLocation: value.GPSlocation, programName: value.programName, programCode: value.programCode});
                            
                            return RobotInfoDB.find({programCode: value._doc.programCode});
                        })
                        .then((value)=>{

                            var devicesList = [
                                {
                                    "hardwareType": "wwRobot",
                                    "hardwareName": "机器人",
                                    count: 0
                                },
                                {
                                    "hardwareType": "HaikangCam",
                                    "hardwareName": "固定摄像头",
                                    count: 0
                                }
                            ];

                            if(value.length>0){
                                /**
                                 * 如果项目下有机器人，则便利每个机器人信息，找到匹配的机器人，并将 count +1.
                                 */
                                
                                value.forEach((e)=>{
                                    var index = devicesList.findIndex((v)=> {return v.hardwareType === e.hardwareType});
                                    ///这里判断机器人类型是否是我们想要的，没有的话，index = -1，我们需要过滤掉
                                    if(index >= 0){ devicesList[index].count = devicesList[index].count + 1; }
                                })
                            }

                            resData[i].devices = devicesList;
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
            }

            return res.status(200).json({statusCode: "connected", msg: "success", param: resData});
        })
        .catch((err)=>{
            switch(err){
                case "100":
                    return res.status(201).json({statusCode: "connected", msg: "token 不正确或已经过期。"})
                default:
                    return;
            }
        })

}