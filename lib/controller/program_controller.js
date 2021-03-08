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
 * {
 *   token: String
 * }
 * 
 */

exports.getProgramListByUserToken = (req, res, next) => {

    const token = req.body.token;

    var resData = [];

    Promise
        .resolve()
        .then(()=>{

            return SessionDB.findOne({token: token});

        })
        .then(async function (value) {
            if(!value){
                throw "100";
            }

            const programCodeList = value.programCode;

            for(var i=0 ; i<programCodeList.length ; i++){
                await ProgramDB.findOne({programCode: programCodeList[i]})
                        .then((value)=>{
                            resData.push({GPSLocation: value.GPSlocation, programName: value.programName, programCode: value.programCode});
                            
                            return RobotInfoDB.find({programCode: value._doc.programCode});
                        })
                        .then((value)=>{

                            var devicesList = [
                                {
                                    "hardwareType": "wwRobot",
                                    "hardwareName": "万维机器人",
                                    count: 0
                                },
                                {
                                    "hardwareType": "HaikangCam",
                                    "hardwareName": "固定摄像头",
                                    count: 0
                                }
                            ];

                            if(value.length>0){
                                
                                value.forEach((e)=>{
                                    var index = devicesList.findIndex((v)=> {return v.hardwareType === e.hardwareType});
                                    devicesList[index].count = devicesList[index].count + 1;
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